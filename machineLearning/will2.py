import pymongo
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import random
import json
import calendar
import time
import os

# Configuración de colores para consola
class Color:
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'
    BLUE = '\033[94m'

# Conexión a MongoDB
# Conexión a MongoDB
uri = "mongodb+srv://houwenvt:will@cluster0.crz8eun.mongodb.net/EcommerML?retryWrites=true&w=majority"
client = pymongo.MongoClient(uri)
db = client["EcommerML"]

# Período de tiempo para las ventas (10 meses)
FECHA_FIN = datetime(2025, 4, 19, 19, 44, 44)  # Fecha actual
FECHA_INICIO = datetime(2024, 7, 1)  # 10 meses antes (aproximadamente)

# Factores estacionales que influirán en el volumen de ventas
FACTORES_ESTACIONALES = {
    # (mes, día): factor_multiplicador
    # Días normales tienen factor 1.0
    
    # Halloween
    (10, 30): 1.8,  # Pre-Halloween
    (10, 31): 2.2,  # Halloween
    
    # Navidad
    (12, 15): 1.5,  # Compras navideñas comienzan a aumentar
    (12, 16): 1.5,
    (12, 17): 1.5,
    (12, 18): 1.5,
    (12, 19): 1.5,
    (12, 20): 1.8,  # Última semana antes de Navidad
    (12, 21): 1.8,
    (12, 22): 2.0,
    (12, 23): 2.2,
    (12, 24): 3.0,  # Nochebuena - pico máximo
    (12, 25): 1.5,  # Navidad
    
    # Fin de año
    (12, 26): 1.8,  # Post-Navidad, compras de fin de año
    (12, 27): 1.8,
    (12, 28): 1.8,
    (12, 29): 2.0,
    (12, 30): 2.2,
    (12, 31): 2.5,  # Nochevieja
    (1, 1): 1.2,    # Año Nuevo
    
    # Carnaval en Bolivia (3-5 marzo 2025)
    (2, 28): 1.5,   # Pre-Carnaval
    (3, 1): 1.8,    # Pre-Carnaval
    (3, 2): 2.0,    # Pre-Carnaval
    (3, 3): 2.2,    # Carnaval
    (3, 4): 2.2,    # Carnaval
    (3, 5): 2.0,    # Carnaval
    
    # Inicio de clases en Bolivia (1 febrero)
    (1, 20): 1.5,   # Preparación para inicio de clases
    (1, 21): 1.5,
    (1, 22): 1.5,
    (1, 23): 1.8,
    (1, 24): 1.8,
    (1, 25): 2.0,
    (1, 26): 2.0,
    (1, 27): 2.0,
    (1, 28): 2.2,
    (1, 29): 2.2,
    (1, 30): 2.5,
    (1, 31): 2.8,   # Día antes del inicio de clases - muy alto
    (2, 1): 3.0,    # Inicio de clases - pico máximo
    (2, 2): 2.5,    # Continúan compras escolares
    (2, 3): 2.2,
    (2, 4): 2.0,
    (2, 5): 1.8,
    (2, 6): 1.5,
    (2, 7): 1.5,
}

# Productos relacionados con temporadas específicas
PRODUCTOS_TEMPORADA = {
    # Back to school (enero-febrero)
    "escolar": ["Mochila", "Escolar", "Lonchera", "Estuche", "Cartuchera", "Niño", "Niña", "Junior", "Kid"],
    
    # Navidad (diciembre)
    "navidad": ["Premium", "Gold", "Edición Limitada", "Pro", "Set", "Kit"],
    
    # Verano (diciembre-enero-febrero en Bolivia)
    "verano": ["Sandalia", "Beach", "Summer", "Ligero", "Lite"]
}

# Categorías de productos por popularidad general
POPULARIDAD_PRODUCTOS = {
    # Muy populares
    "alta": ["Mochila", "Maleta", "Bolso", "Tenis", "Zapatilla", "Case"],
    
    # Popularidad media
    "media": ["Camiseta", "Pantalón", "Chaqueta", "Morral", "Lonchera"],
    
    # Menos populares
    "baja": ["Audífonos", "Cargador", "Powerbank", "Estuche"]
}

# Rangos de edad y productos asociados
SEGMENTOS_EDAD = {
    "infantil": ["Niño", "Niña", "Kid", "Junior", "Princess", "Hero"],
    "juvenil": ["Urbana", "Fashion", "Sport", "Runner", "College"],
    "adulto": ["Classic", "Elegant", "Premium", "Ejecutivo", "Pro"]
}

# Definición de segmentos de clientes
SEGMENTOS_CLIENTES = {
    "frecuente": 0.15,    # 15% son compradores frecuentes
    "regular": 0.55,      # 55% son compradores regulares
    "ocasional": 0.30,    # 30% son compradores ocasionales
}

def cargar_datos():
    """Carga los datos necesarios de MongoDB"""
    print(f"\n{Color.BLUE}{Color.BOLD}Cargando datos de la base de datos...{Color.END}")
    
    # Cargar productos (solo activos)
    productos = list(db.productos.find({"estado": True}))
    if not productos:
        print(f"{Color.WARNING}No se encontraron productos activos.{Color.END}")
    
    # Cargar variantes con stock disponible
    variantes = list(db.producto_variedads.find({"cantidad": {"$gt": 0}}))
    if not variantes:
        print(f"{Color.WARNING}No se encontraron variantes con stock disponible.{Color.END}")
    
    # Cargar clientes activos
    clientes = list(db.clientes.find({"estado": True}))
    if not clientes:
        print(f"{Color.WARNING}No se encontraron clientes activos.{Color.END}")
    
    # Crear diccionario de variantes por producto
    variantes_por_producto = {}
    for v in variantes:
        producto_id = str(v["producto"])
        if producto_id not in variantes_por_producto:
            variantes_por_producto[producto_id] = []
        variantes_por_producto[producto_id].append(v)
    
    print(f"{Color.GREEN}✓ Datos cargados: {len(productos)} productos, {len(variantes)} variantes, {len(clientes)} clientes{Color.END}")
    
    return productos, variantes, clientes, variantes_por_producto

def asignar_segmentos_cliente(clientes):
    """Asigna a cada cliente un segmento basado en comportamiento de compra"""
    segmentos = {}
    for cliente in clientes:
        r = random.random()
        if r < SEGMENTOS_CLIENTES["frecuente"]:
            segmentos[str(cliente["_id"])] = "frecuente"
        elif r < SEGMENTOS_CLIENTES["frecuente"] + SEGMENTOS_CLIENTES["regular"]:
            segmentos[str(cliente["_id"])] = "regular"
        else:
            segmentos[str(cliente["_id"])] = "ocasional"
    return segmentos

def obtener_probabilidad_compra(cliente_id, segmentos, fecha, semilla_personalizada=None):
    """Calcula la probabilidad de compra según el segmento y la fecha"""
    # Usar semilla personalizada para mantener consistencia por cliente
    if semilla_personalizada:
        random.seed(str(semilla_personalizada) + str(fecha.toordinal()))
    
    # Probabilidad base por segmento
    base_prob = {
        "frecuente": 0.12,    # 12% chance de compra en un día normal
        "regular": 0.04,      # 4% chance de compra en un día normal
        "ocasional": 0.01     # 1% chance de compra en un día normal
    }
    
    segment = segmentos.get(str(cliente_id), "regular")
    prob = base_prob[segment]
    
    # Ajustar por estacionalidad
    mes_dia = (fecha.month, fecha.day)
    if mes_dia in FACTORES_ESTACIONALES:
        prob *= FACTORES_ESTACIONALES[mes_dia]
    
    # Aumentar probabilidad en fines de semana
    if fecha.weekday() >= 5:  # 5=Sábado, 6=Domingo
        prob *= 1.5
    
    # Ajuste por temporada de pago (quincena y fin de mes)
    if fecha.day in [15, 16, 30, 31, 1]:
        prob *= 1.4
    
    # Restaurar semilla aleatoria
    if semilla_personalizada:
        random.seed()
    
    return min(prob, 0.95)  # Limitar a 95% máximo

def seleccionar_productos_para_compra(productos, variantes_por_producto, fecha, cliente, max_items=6):
    """Selecciona productos para una compra basándose en la fecha y el perfil del cliente"""
    # Extraer información de cliente para preferencias
    es_hombre = False
    es_mujer = False
    es_nino = False
    
    # Probabilidad base por temporada
    temporada_actual = []
    
    # Temporada escolar (enero, febrero)
    if fecha.month in [1, 2]:
        temporada_actual.append("escolar")
    # Temporada navideña (diciembre)
    if fecha.month == 12:
        temporada_actual.append("navidad")
    # Verano en Bolivia (diciembre a febrero)
    if fecha.month in [12, 1, 2]:
        temporada_actual.append("verano")
    
    # Determinar número de productos en esta compra (probabilidad más alta de compras pequeñas)
    num_items = random.choices([1, 2, 3, 4, 5, 6], weights=[40, 30, 15, 8, 5, 2])[0]
    num_items = min(num_items, max_items)
    
    # Filtrar productos disponibles
    productos_disponibles = []
    for p in productos:
        producto_id = str(p["_id"])
        # Verificar que el producto tenga variantes disponibles
        if producto_id in variantes_por_producto and variantes_por_producto[producto_id]:
            productos_disponibles.append(p)
    
    if not productos_disponibles:
        return []
    
    # Asignar pesos a los productos según temporada y popularidad
    productos_con_peso = []
    for p in productos_disponibles:
        titulo = p.get("titulo", "").lower()
        clasificacion = p.get("clasificacion", "").lower()
        subcategoria = p.get("subcategorias", "").lower()
        
        # Peso base
        peso = 1.0
        
        # Aumentar peso para productos de la temporada actual
        for temp in temporada_actual:
            for keyword in PRODUCTOS_TEMPORADA.get(temp, []):
                if keyword.lower() in titulo or keyword.lower() in subcategoria:
                    peso *= 2.5
                    break
        
        # Ajustar peso por popularidad general
        for keyword in POPULARIDAD_PRODUCTOS["alta"]:
            if keyword.lower() in titulo:
                peso *= 1.8
                break
        
        for keyword in POPULARIDAD_PRODUCTOS["media"]:
            if keyword.lower() in titulo:
                peso *= 1.3
                break
        
        productos_con_peso.append((p, peso))
    
    # Seleccionar productos según pesos
    seleccion_productos = []
    intentos = 0
    
    while len(seleccion_productos) < num_items and intentos < 30:
        intentos += 1
        
        if not productos_con_peso:
            break
        
        # Seleccionar producto basado en pesos
        productos_candidatos = [p[0] for p in productos_con_peso]
        pesos_candidatos = [p[1] for p in productos_con_peso]
        producto = random.choices(productos_candidatos, weights=pesos_candidatos, k=1)[0]
        
        # Encontrar variantes disponibles para este producto
        producto_id = str(producto["_id"])
        if producto_id not in variantes_por_producto or not variantes_por_producto[producto_id]:
            continue
        
        # Verificar que este producto no esté ya seleccionado
        if any(p["producto"]["_id"] == producto["_id"] for p in seleccion_productos):
            continue
        
        # Seleccionar una variante aleatoria
        variante = random.choice(variantes_por_producto[producto_id])
        
        # Determinar cantidad (considerar límites de stock)
        stock_disponible = variante.get("cantidad", 0)
        if stock_disponible <= 0:
            continue
        
        # La mayoría de compras son de 1 unidad, muy pocas de más unidades
        cantidad = min(random.choices([1, 2, 3], weights=[85, 12, 3])[0], stock_disponible)
        
        # Añadir producto a la selección
        seleccion_productos.append({
            "producto": producto,
            "variante": variante,
            "cantidad": cantidad
        })
    
    return seleccion_productos

def generar_ventas(fecha_inicio, fecha_fin, productos, variantes, clientes, variantes_por_producto):
    """Genera datos de ventas para el período especificado"""
    print(f"\n{Color.BLUE}{Color.BOLD}Generando ventas del {fecha_inicio.strftime('%d/%m/%Y')} al {fecha_fin.strftime('%d/%m/%Y')}{Color.END}")
    
    ventas = []
    venta_detalles = []
    ingreso_detalles = []
    
    # Asignar segmentos a clientes
    segmentos_cliente = asignar_segmentos_cliente(clientes)
    
    # Para estadísticas
    ventas_por_mes = {}
    total_por_mes = {}
    clientes_sin_compra = 0  # Contador para clientes que no pueden comprar por fecha
    
    # Generar ventas día por día
    fecha_actual = fecha_inicio
    dias_procesados = 0
    total_dias = (fecha_fin - fecha_inicio).days + 1
    
    while fecha_actual <= fecha_fin:
        # Mostrar progreso cada 10 días
        if dias_procesados % 10 == 0:
            progress = (dias_procesados / total_dias) * 100
            print(f"Procesando {fecha_actual.strftime('%d/%m/%Y')} - {progress:.1f}% completado")
        
        mes_actual = fecha_actual.strftime("%B %Y")
        if mes_actual not in ventas_por_mes:
            ventas_por_mes[mes_actual] = 0
            total_por_mes[mes_actual] = 0
        
        # Por cada cliente, determinar si realiza una compra este día
        clientes_compradores = []
        for cliente in clientes:
            # CORRECCIÓN: Verificar que el cliente ya existía en esta fecha
            fecha_creacion = cliente.get("createdAT")
            
            if fecha_creacion and fecha_actual >= fecha_creacion:
                # El cliente ya existe en esta fecha, puede realizar compras
                semilla = str(cliente["_id"])
                prob_compra = obtener_probabilidad_compra(
                    str(cliente["_id"]), 
                    segmentos_cliente, 
                    fecha_actual, 
                    semilla
                )
                
                # Decidir si este cliente compra hoy
                if random.random() < prob_compra:
                    clientes_compradores.append(cliente)
            else:
                # El cliente aún no existe en esta fecha
                clientes_sin_compra += 1
        
        # Para cada cliente que compra, generar su compra
        for cliente in clientes_compradores:
            # Determinar hora de compra (7am a 11pm)
            hora_compra = random.randint(7, 23)
            minuto_compra = random.randint(0, 59)
            segundo_compra = random.randint(0, 59)
            
            timestamp_compra = fecha_actual.replace(
                hour=hora_compra,
                minute=minuto_compra,
                second=segundo_compra
            )
            
            # Seleccionar productos para esta compra
            productos_seleccionados = seleccionar_productos_para_compra(
                productos, 
                variantes_por_producto,
                fecha_actual,
                cliente
            )
            
            if not productos_seleccionados:
                continue  # No se encontraron productos válidos
            
            # Calcular total de la compra
            total_compra = sum(
                p["variante"].get("precio", 0) * p["cantidad"] 
                for p in productos_seleccionados
            )
            
            # Crear documento de venta
            venta_id = ObjectId()
            venta = {
                "_id": venta_id,
                "cliente": cliente["_id"],
                "total": total_compra,
                "envio": 0,  # Sin costo de envío según ejemplo
                "estado": "Procesado",
                "createdAT": timestamp_compra,
                "__v": 0
            }
            ventas.append(venta)
            ventas_por_mes[mes_actual] += 1
            total_por_mes[mes_actual] += total_compra
            
            # Crear detalles de venta para cada producto
            for datos_producto in productos_seleccionados:
                producto = datos_producto["producto"]
                variante = datos_producto["variante"]
                cantidad = datos_producto["cantidad"]
                
                # Crear detalle
                detalle = {
                    "_id": ObjectId(),
                    "cliente": cliente["_id"],
                    "venta": venta_id,
                    "producto": producto["_id"],
                    "variedad": variante["_id"],
                    "cantidad": cantidad,
                    "precio": variante.get("precio", 0),
                    "createdAT": timestamp_compra + timedelta(milliseconds=random.randint(1, 100)),
                    "__v": 0
                }
                venta_detalles.append(detalle)
                
                try:
                    cantidad_int = int(cantidad)
                    
                    # Buscar los ingresos correspondientes
                    ingresos = list(db.ingresodetalles.find(
                        {"producto_variedad": variante["_id"], "estado": True}
                    ).sort("createdAT", -1).limit(cantidad_int))
                    
                    if len(ingresos) < cantidad_int:
                        print(f"{Color.WARNING}Advertencia: No hay suficientes registros de ingreso para {producto['titulo']} (variante {variante['_id']}).{Color.END}")
            
                    # Preparar operaciones de actualización en lote
                    if ingresos:
                        bulk_operations = []
                        for ingreso in ingresos:
                            bulk_operations.append(
                                pymongo.UpdateOne(
                                    {"_id": ingreso["_id"]},
                                    {"$set": {
                                        "estado": False,
                                        "venta": venta_id,
                                        "ventaDetalle": detalle["_id"],
                                    }}
                                )
                            )
                        
                        if bulk_operations:
                            db.ingresodetalles.bulk_write(bulk_operations)
                except Exception as e:
                    # Correcto
                    print(f"{Color.WARNING}Error procesando variante {variante['_id']}: {str(e)}{Color.END}")
        
        # Avanzar al siguiente día
        fecha_actual += timedelta(days=1)
        dias_procesados += 1
    
    # Mostrar estadísticas
    print(f"\n{Color.GREEN}{Color.BOLD}Ventas generadas: {len(ventas)} con {len(venta_detalles)} detalles{Color.END}")
    print(f"{Color.GREEN}Clientes rechazados por fecha de creación posterior: {clientes_sin_compra} intentos{Color.END}")
    
    print("\nDistribución por mes:")
    for mes in sorted(ventas_por_mes.keys()):
        print(f"  • {mes}: {ventas_por_mes[mes]} ventas, ${total_por_mes[mes]} total")
    
    return ventas, venta_detalles

def insertar_datos_ventas(ventas, venta_detalles):
    """Inserta los datos de ventas en MongoDB"""
    print(f"\n{Color.BLUE}{Color.BOLD}Insertando datos en la base de datos...{Color.END}")
    
    # Eliminar datos existentes
    db.ventas.delete_many({})
    db.ventadetalles.delete_many({})
    print(f"{Color.GREEN}✓ Colecciones limpiadas{Color.END}")
    
    # Insertar nuevos datos
    if ventas:
        db.ventas.insert_many(ventas)
        print(f"{Color.GREEN}✓ Se insertaron {len(ventas)} ventas{Color.END}")
    
    if venta_detalles:
        db.ventadetalles.insert_many(venta_detalles)
        print(f"{Color.GREEN}✓ Se insertaron {len(venta_detalles)} detalles de venta{Color.END}")

def analizar_datos_ventas(ventas, venta_detalles):
    """Analiza y muestra estadísticas sobre las ventas generadas"""
    print(f"\n{Color.BLUE}{Color.BOLD}=== ANÁLISIS DE DATOS DE VENTAS ==={Color.END}")
    
    # Estadísticas por temporada
    ventas_por_temporada = {
        "Navidad (Dic)": 0,
        "Inicio de Clases (Feb)": 0,
        "Carnaval (Mar)": 0,
        "Halloween (Oct)": 0,
        "Resto del año": 0
    }
    
    for venta in ventas:
        fecha = venta["createdAT"]
        if fecha.month == 12 and 15 <= fecha.day <= 31:
            ventas_por_temporada["Navidad (Dic)"] += 1
        elif fecha.month == 2 and 1 <= fecha.day <= 10:
            ventas_por_temporada["Inicio de Clases (Feb)"] += 1
        elif fecha.month == 3 and 1 <= fecha.day <= 6:
            ventas_por_temporada["Carnaval (Mar)"] += 1
        elif fecha.month == 10 and 29 <= fecha.day <= 31:
            ventas_por_temporada["Halloween (Oct)"] += 1
        else:
            ventas_por_temporada["Resto del año"] += 1
    
    print("\nVentas por temporada:")
    for temporada, cantidad in ventas_por_temporada.items():
        porcentaje = (cantidad / len(ventas)) * 100 if ventas else 0
        print(f"  • {temporada}: {cantidad} ventas ({porcentaje:.1f}%)")
    
    # Segmentación de clientes por frecuencia de compra
    cliente_compras = {}
    for venta in ventas:
        cliente_id = str(venta["cliente"])
        cliente_compras[cliente_id] = cliente_compras.get(cliente_id, 0) + 1
    
    # Clasificar clientes
    clientes_frecuentes = [c for c, compras in cliente_compras.items() if compras >= 5]
    clientes_regulares = [c for c, compras in cliente_compras.items() if 2 <= compras < 5]
    clientes_ocasionales = [c for c, compras in cliente_compras.items() if compras == 1]
    
    print(f"\nSegmentación de clientes:")
    print(f"  • Frecuentes (5+ compras): {len(clientes_frecuentes)} clientes")
    print(f"  • Regulares (2-4 compras): {len(clientes_regulares)} clientes")
    print(f"  • Ocasionales (1 compra): {len(clientes_ocasionales)} clientes")
    
    # Valor promedio de compra
    if ventas:
        total_ventas = sum(v["total"] for v in ventas)
        promedio = total_ventas / len(ventas)
        print(f"\nValor promedio por compra: ${promedio:.2f}")

    # Analizar ventas por antigüedad del cliente
    ventas_por_antiguedad = {
        "Nuevos (0-30 días)": 0,
        "Recientes (31-90 días)": 0,
        "Establecidos (91-180 días)": 0,
        "Antiguos (180+ días)": 0
    }
    
    # Obtener todos los clientes que han realizado compras
    clientes_con_compras = set(str(v["cliente"]) for v in ventas)
    
    # Para cada cliente, calcular la primera y última compra
    for cliente_id in clientes_con_compras:
        # Encontrar todas las ventas de este cliente
        ventas_cliente = [v for v in ventas if str(v["cliente"]) == cliente_id]
        
        # Ordenar por fecha
        ventas_cliente.sort(key=lambda x: x["createdAT"])
        
        # Buscar datos del cliente
        cliente_info = next((c for c in db.clientes.find({"_id": ObjectId(cliente_id)})), None)
        
        if cliente_info and ventas_cliente:
            # Primera compra del cliente
            primera_compra = ventas_cliente[0]["createdAT"]
            
            # Calcular días desde la creación hasta la primera compra
            dias_hasta_primera_compra = (primera_compra - cliente_info.get("createdAT", primera_compra)).days
            
            if dias_hasta_primera_compra <= 30:
                ventas_por_antiguedad["Nuevos (0-30 días)"] += 1
            elif dias_hasta_primera_compra <= 90:
                ventas_por_antiguedad["Recientes (31-90 días)"] += 1
            elif dias_hasta_primera_compra <= 180:
                ventas_por_antiguedad["Establecidos (91-180 días)"] += 1
            else:
                ventas_por_antiguedad["Antiguos (180+ días)"] += 1
    
    print("\nPrimera compra por antigüedad del cliente:")
    total_clientes = len(clientes_con_compras)
    for categoria, cantidad in ventas_por_antiguedad.items():
        porcentaje = (cantidad / total_clientes) * 100 if total_clientes > 0 else 0
        print(f"  • {categoria}: {cantidad} clientes ({porcentaje:.1f}%)")

def confirmar_ventas(ventas, venta_detalles):
    """Confirma un porcentaje de las ventas generadas (simula la acción del administrador)"""
    print(f"\n{Color.BLUE}{Color.BOLD}Confirmando ventas (simulando acción del administrador)...{Color.END}")
    
    # Definir estados posibles y sus probabilidades (sin "Cancelado")
    estados = ["Confirmado", "Procesado"]
    # 75% confirmadas, 25% se quedan en "Procesado"
    probabilidades = [0.75, 0.25]
    
    ventas_por_estado = {
        "Confirmado": 0,
        "Procesado": 0
    }
    
    # Agrupar detalles de venta por venta_id para procesar juntos
    detalles_por_venta = {}
    for detalle in venta_detalles:
        venta_id = detalle["venta"]
        if venta_id not in detalles_por_venta:
            detalles_por_venta[venta_id] = []
        detalles_por_venta[venta_id].append(detalle)
    
    # Procesar cada venta
    for venta in ventas:
        venta_id = venta["_id"]
        
        # Determinar nuevo estado basado en probabilidades
        nuevo_estado = random.choices(estados, probabilidades)[0]
        
        # Si el estado no cambia (sigue en "Procesado"), continuar al siguiente
        if nuevo_estado == "Procesado":
            ventas_por_estado["Procesado"] += 1
            continue
        
        # Para "Confirmado", el valor booleano siempre es True
        boo_estado = True
        
        try:
            # Actualizar la venta
            db.ventas.update_one(
                {"_id": venta_id},
                {"$set": {"estado": nuevo_estado}}
            )
            
            # Actualizar todos los detalles asociados
            db.ventadetalles.update_many(
                {"venta": venta_id},
                {"$set": {"estado_": nuevo_estado, "estado": boo_estado}}
            )
            
            ventas_por_estado[nuevo_estado] += 1
            
        except Exception as e:
            print(f"{Color.WARNING}Error al actualizar venta {venta_id}: {str(e)}{Color.END}")
    
    # Mostrar estadísticas
    print(f"\n{Color.GREEN}✓ Proceso de confirmación completado{Color.END}")
    print("\nResumen de estados:")
    total_ventas = len(ventas)
    for estado, cantidad in ventas_por_estado.items():
        porcentaje = (cantidad / total_ventas) * 100
        print(f"  • {estado}: {cantidad} ventas ({porcentaje:.1f}%)")
        
def main():
    try:
        print(f"\n{Color.BOLD}{'=' * 60}{Color.END}")
        print(f"{Color.BOLD}GENERADOR DE VENTAS REALISTAS - 10 MESES{Color.END}")
        print(f"{Color.BOLD}{'=' * 60}{Color.END}")
        print(f"Usuario: muimui69sii")
        print(f"Fecha actual: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Cargar datos
        productos, variantes, clientes, variantes_por_producto = cargar_datos()
        if not productos or not variantes or not clientes:
            print(f"{Color.FAIL}Error: Faltan datos necesarios en la base de datos.{Color.END}")
            return
        
        # Generar ventas
        ventas, venta_detalles = generar_ventas(
            FECHA_INICIO, FECHA_FIN, 
            productos, variantes, clientes, variantes_por_producto
        )
        
        if not ventas:
            print(f"{Color.FAIL}No se generaron ventas.{Color.END}")
            return
        
        # Preguntar si queremos insertar los datos
        print(f"\n{Color.BOLD}Se generaron {len(n)} ventas con {len(venta_detalles)} detalles.{Color.END}")
        respuesta = input("¿Desea insertar estos datos en la base de datos? (s/n): ")
        
        if respuesta.lower() in ['s', 'si', 'y', 'yes']:
            insertar_datos_ventas(ventas, venta_detalles)
            
            # Preguntar si también desea confirmar ventas
            respuesta_confirmar = input("\n¿Desea simular la confirmación de ventas por el administrador? (s/n): ")
            if respuesta_confirmar.lower() in ['s', 'si', 'y', 'yes']:
                confirmar_ventas(ventas, venta_detalles)
                
            analizar_datos_ventas(ventas, venta_detalles)
            print(f"\n{Color.GREEN}{Color.BOLD}Proceso completado con éxito{Color.END}")
        else:
            print(f"\n{Color.WARNING}Operación cancelada. Los datos no fueron insertados.{Color.END}")
    
    except Exception as e:
        print(f"\n{Color.FAIL}Error: {str(e)}{Color.END}")

if __name__ == "__main__":
    main()