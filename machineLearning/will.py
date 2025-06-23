import pymongo
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import random
import json
import calendar
import re
import os

# Colores para mensajes en consola
class Color:
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'
    BLUE = '\033[94m'

# Conexión a MongoDB
uri = "mongodb+srv://houwenvt:will@cluster0.crz8eun.mongodb.net/EcommerML?retryWrites=true&w=majority"
client = pymongo.MongoClient(uri)
db = client["EcommerML"]

# Fecha actual (abril 2025)
FECHA_FINAL = datetime(2025, 4, 18, 0, 18, 31)
# Fecha inicial (10 meses atrás = julio 2024)
FECHA_INICIAL = datetime(2024, 7, 1, 8, 0, 0)

# DATOS FIJOS - IDs de los elementos que ya existen
USUARIO_ID = ObjectId("6804481aff289ead1db5eeb8")  # ID del usuario admin
PROVEEDOR_ID = ObjectId("68044844ff289ead1db5eee1")  # ID del proveedor TottoColombia
ALMACEN_ID = ObjectId("68044859ff289ead1db5ef03")  # ID del almacén Centro

# Periodos especiales para inventario
PERIODOS_ESPECIALES = {
    # (mes, año): factor_importancia
    (7, 2024): 1.0,    # Julio 2024 - Normal
    (8, 2024): 1.5,    # Agosto 2024 - Preparación vuelta a clases
    (9, 2024): 1.2,    # Septiembre 2024 - Post vuelta a clases
    (10, 2024): 1.0,   # Octubre 2024 - Normal
    (11, 2024): 1.8,   # Noviembre 2024 - Preparación Navidad
    (12, 2024): 2.0,   # Diciembre 2024 - Navidad
    (1, 2025): 1.0,    # Enero 2025 - Post Navidad
    (2, 2025): 2.0,    # Febrero 2025 - Inicio de clases
    (3, 2025): 1.5,    # Marzo 2025 - Post inicio de clases
    (4, 2025): 1.2,    # Abril 2025 - Normal+
}

# Categorías y productos especiales por mes
PRODUCTOS_ESPECIALES_POR_MES = {
    # (mes, año): [categorías o palabras clave]
    (8, 2024): ["Mochilas", "Maletas", "Escolar", "Lonchera", "Estuche", "Cartuchera"],
    (11, 2024): ["Premium", "Edición Limitada", "Kit", "Set"],
    (12, 2024): ["Premium", "Edición Limitada", "Kit", "Set"],
    (2, 2025): ["Mochilas", "Maletas", "Escolar", "Lonchera", "Estuche", "Cartuchera"],
}

def cargar_productos_desde_json(json_data):
    """Carga y procesa los productos desde el JSON proporcionado"""
    productos = []
    
    for producto in json_data:
        # Extraer información relevante
        producto_id = ObjectId(producto["_id"]["$oid"])
        titulo = producto["titulo"]
        categoria_id = ObjectId(producto["categoria"]["$oid"]) if "categoria" in producto else None
        subcategoria = producto.get("subcategorias", "")
        estado = producto.get("estado", False)
        
        # Solo considerar productos activos
        if estado:
            # Crear objeto de producto con la info necesaria
            info_producto = {
                "id": producto_id,
                "nombre": titulo,
                "categoria_id": categoria_id,
                "subcategoria": subcategoria
            }
            productos.append(info_producto)
    
    return productos

def generar_codigo(prefijo):
    """Genera un código de detalle con el formato específico"""
    hex_part = ''.join(random.choices("0123456789ABCDEF", k=8))
    return f"{prefijo}68{hex_part}"

def calcular_dias_laborables(mes, anio):
    """Calcula los días laborables (lun-vie) para un mes y año determinados"""
    cal = calendar.monthcalendar(anio, mes)
    dias_laborables = []
    
    # Para cada semana en el mes
    for semana in cal:
        # Para cada día en la semana (0=lunes, 6=domingo)
        for i, dia in enumerate(semana):
            # Si no es 0 (día vacío) y es lun-vie (0-4)
            if dia != 0 and i < 5:
                dias_laborables.append(dia)
    
    return dias_laborables

def obtener_ingresos_por_mes(productos):
    """Planifica cuántos ingresos hacer por mes según la época del año"""
    ingresos_por_mes = {}
    total_productos = len(productos)
    
    for (mes, anio), factor in PERIODOS_ESPECIALES.items():
        # Base: aproximadamente 30-40% de los productos necesitan reposición cada mes
        # Ajustado por factor de importancia del mes
        base_ingresos = int(total_productos * 0.35 * factor)
        
        # Añadir algo de variabilidad
        variabilidad = random.randint(-10, 10)
        ingresos_por_mes[(mes, anio)] = max(15, base_ingresos + variabilidad)
    
    return ingresos_por_mes

def es_producto_especial(producto, mes, anio):
    """Determina si un producto es especial para un mes específico"""
    if (mes, anio) not in PRODUCTOS_ESPECIALES_POR_MES:
        return False
        
    palabras_clave = PRODUCTOS_ESPECIALES_POR_MES[(mes, anio)]
    
    # Verificar si alguna palabra clave está en el nombre o subcategoría
    nombre_completo = producto["nombre"].lower()
    subcategoria = producto["subcategoria"].lower()
    
    for palabra in palabras_clave:
        if palabra.lower() in nombre_completo or palabra.lower() in subcategoria:
            return True
            
    return False

def obtener_fecha_ingreso(mes, anio):
    """Genera una fecha aleatoria en el mes y año indicados (solo días laborables)"""
    dias_laborables = calcular_dias_laborables(mes, anio)
    dia = random.choice(dias_laborables)
    
    # Horario de trabajo (8:00 - 17:00)
    hora = random.randint(8, 17)
    minuto = random.randint(0, 59)
    segundo = random.randint(0, 59)
    
    return datetime(anio, mes, dia, hora, minuto, segundo)

def obtener_precio_unitario(producto):
    """Determina un precio unitario adecuado según el tipo de producto"""
    nombre = producto["nombre"].lower()
    
    # Precios base por tipo de producto
    if any(x in nombre for x in ["mochila", "maleta", "bolso"]):
        return random.randint(90, 180)
    elif any(x in nombre for x in ["chaqueta", "pantalón", "zapatilla", "tenis", "bota"]):
        return random.randint(70, 150)
    elif any(x in nombre for x in ["camiseta", "estuche", "lonchera"]):
        return random.randint(40, 90)
    elif any(x in nombre for x in ["audífono", "cargador", "gadget", "powerbank"]):
        return random.randint(30, 120)
    else:
        return random.randint(50, 100)

def obtener_cantidad_ingreso(producto, mes, anio):
    """Determina la cantidad a ingresar basado en el tipo de producto y temporada"""
    factor_temporada = PERIODOS_ESPECIALES.get((mes, anio), 1.0)
    es_especial = es_producto_especial(producto, mes, anio)
    
    # Base cantidad
    if es_especial:
        base = random.randint(15, 30)
    else:
        base = random.randint(5, 15)
    
    # Ajustar por temporada
    return int(base * factor_temporada)

def crear_ingresos_por_temporada(productos):
    """Crea ingresos de inventario distribuidos en 10 meses"""
    print(f"\n{Color.BLUE}{Color.BOLD}=== GENERANDO INGRESOS DE INVENTARIO - 10 MESES ==={Color.END}")
    print(f"Periodo: {FECHA_INICIAL.strftime('%B %Y')} - {FECHA_FINAL.strftime('%B %Y')}")
    
    # Limpiar ingresos y detalles existentes
    db.ingresos.delete_many({})
    db.ingresodetalles.delete_many({})
    print(f"{Color.GREEN}✅ Colecciones limpiadas{Color.END}")
    
    ingresos_por_mes = obtener_ingresos_por_mes(productos)
    
    # Contador para códigos secuenciales de ingresos
    codigo_ingreso = 1
    total_ingresos = 0
    total_detalles = 0
    resumen_por_mes = {}
    
    # Crear ingresos para cada mes del periodo
    for (mes, anio), num_ingresos in ingresos_por_mes.items():
        print(f"\n{Color.BOLD}Procesando {calendar.month_name[mes]} {anio} - {num_ingresos} ingresos{Color.END}")
        ingresos_mes_actual = 0
        detalles_mes_actual = 0
        
        # Productos disponibles para este mes (copia para poder quitar productos ya usados)
        productos_disponibles = productos.copy()
        
        # Priorizar productos especiales para este mes
        productos_especiales = []
        productos_regulares = []
        
        for p in productos_disponibles:
            if es_producto_especial(p, mes, anio):
                productos_especiales.append(p)
            else:
                productos_regulares.append(p)
        
        # Reorganizar la lista para tener primero los productos especiales
        random.shuffle(productos_especiales)
        random.shuffle(productos_regulares)
        productos_ordenados = productos_especiales + productos_regulares
        
        # Limitar al número de ingresos para este mes
        productos_para_usar = productos_ordenados[:num_ingresos]
        
        # Crear ingresos para este mes
        for producto in productos_para_usar:
            # Generar fecha de ingreso para este mes
            fecha_ingreso = obtener_fecha_ingreso(mes, anio)
            
            # Buscar variantes para este producto
            variantes = list(db.producto_variedads.find({"producto": producto["id"]}))
            
            if not variantes:
                print(f"{Color.WARNING}⚠️ No se encontraron variantes para {producto['nombre']}{Color.END}")
                continue
            
            # Elegir algunas variantes aleatorias para este ingreso (entre 1-3)
            num_variantes = min(random.randint(1, 3), len(variantes))
            variantes_seleccionadas = random.sample(variantes, num_variantes)
            
            # Datos del ingreso
            total_ingreso = 0
            
            # Crear ingreso
            ingreso_id = ObjectId()
            ingreso = {
                "_id": ingreso_id,
                "usuario": USUARIO_ID,
                "proveedor": PROVEEDOR_ID,
                "almacen": ALMACEN_ID,
                "total": 0,  # Se actualizará después
                "tipo": "Compra",
                "codigo": codigo_ingreso,
                "estado": "Confirmado",
                "createdAT": fecha_ingreso,
                "__v": 0
            }
            
            detalles_ingreso = 0
            
            # Crear detalles para cada variante seleccionada
            for variante in variantes_seleccionadas:
                precio_unitario = obtener_precio_unitario(producto)
                cantidad = obtener_cantidad_ingreso(producto, mes, anio)
                
                # Generar prefijo para códigos de detalle
                palabras = producto["nombre"].split()
                prefijo = ''.join(p[0:2] for p in palabras[:2] if p)  # Primeras 2 letras de primeras 2 palabras
                if len(prefijo) < 2:
                    prefijo = producto["nombre"][:2]  # En caso de nombres muy cortos
                
                # Crear un detalle por cada unidad
                for j in range(cantidad):
                    codigo = generar_codigo(prefijo)
                    
                    detalle = {
                        "_id": ObjectId(),
                        "ingreso": ingreso_id,
                        "producto": producto["id"],
                        "producto_variedad": variante["_id"],
                        "almacen": ALMACEN_ID,
                        "precioUnidad": precio_unitario,
                        "codigo": codigo,
                        "estado": True,
                        "estado_": "Confirmado",
                        "createdAT": fecha_ingreso + timedelta(milliseconds=j+1),
                        "__v": 0
                    }
                    
                    # Insertar el detalle
                    db.ingresodetalles.insert_one(detalle)
                    detalles_ingreso += 1
                    detalles_mes_actual += 1
                    total_detalles += 1
                    total_ingreso += precio_unitario
                
                # Actualizar la cantidad y precio en la variante del producto
                db.producto_variedads.update_one(
                    {"_id": variante["_id"]},
                    {"$set": {
                        "cantidad": cantidad,
                        "precio": round(precio_unitario * 1.4)  # 40% de margen
                    }}
                )
            
            # Actualizar el total del ingreso
            ingreso["total"] = total_ingreso
            
            # Insertar el ingreso solo si tiene detalles
            if detalles_ingreso > 0:
                db.ingresos.insert_one(ingreso)
                ingresos_mes_actual += 1
                total_ingresos += 1
                codigo_ingreso += 1  # Incrementar para el próximo
            
        # Guardar resumen del mes
        resumen_por_mes[f"{calendar.month_name[mes]} {anio}"] = {
            "ingresos": ingresos_mes_actual,
            "detalles": detalles_mes_actual,
        }
                
    # Mostrar resultados
    print(f"\n{Color.BLUE}{Color.BOLD}=== RESUMEN DE INGRESOS GENERADOS ==={Color.END}")
    print(f"{Color.GREEN}✅ Total ingresos creados: {total_ingresos}{Color.END}")
    print(f"{Color.GREEN}✅ Total detalles creados: {total_detalles}{Color.END}")
    
    print(f"\n{Color.BOLD}Distribución por mes:{Color.END}")
    for mes, datos in resumen_por_mes.items():
        print(f"  • {mes}: {datos['ingresos']} ingresos, {datos['detalles']} unidades")
    
    return total_ingresos, total_detalles

if __name__ == "__main__":
    try:
        # Extraer los productos del JSON proporcionado
        # json_data = json.loads("""
        # [
        #     {"_id": {"$oid": "6801c1f17a8bebb1f4a81a8e"}, "titulo": "Set Eco-friendly Plus Pro 914", "portada": "332bd8f1-5d56-4333-b519-445db0d44c08.jpg", "slug": "set-eco-friendly-plus-pro-914", "descripcion": "Calidad premium y estilo contemporáneo. La combinación perfecta de practicidad y tendencia actual.", "etiqueta": "Exclusivo", "clasificacion": "Femenino", "categoria": {"$oid": "68018b9a558d98e8376668bf"}, "subcategorias": "Eco-friendly", "labels": ["etiqueta_1", "etiqueta_2", "etiqueta_3"], "estado": true, "createdAT": {"$date": "2025-04-18T04:13:42.000Z"}, "__v": 0},
        #     {"_id": {"$oid": "6801c1f17a8bebb1f4a81a93"}, "titulo": "Camiseta Princess 2.0 258", "portada": "25e9e321-feba-42a9-aaaf-b60763341070.jpg", "slug": "camiseta-princess-2-0-258", "descripcion": "Línea exclusiva con los más altos estándares de calidad. Un producto indispensable para tu día a día.", "etiqueta": "Destacado", "clasificacion": "Niñas", "categoria": {"$oid": "68018b9a558d98e8376668b5"}, "subcategorias": "Camisetas", "labels": ["etiqueta_1", "etiqueta_2"], "estado": true, "createdAT": {"$date": "2025-04-18T01:41:42.000Z"}, "__v": 0},
        #     {"_id": {"$oid": "6801c1f17a8bebb1f4a81a9b"}, "titulo": "Case Phone Cute Max 427", "portada": "3c58d76d-88d8-4ba9-8c27-e4fb70a76b09.jpg", "slug": "case-phone-cute-max-427", "descripcion": "Diseño minimalista pero funcional. Perfecto para quienes buscan simplicidad sin renunciar al estilo.", "etiqueta": "Exclusivo", "clasificacion": "Niñas", "categoria": {"$oid": "68018b9a558d98e8376668bd"}, "subcategorias": "Gadgets Infantiles", "labels": ["etiqueta_1", "etiqueta_2", "etiqueta_3", "etiqueta_4", "etiqueta_5"], "estado": true, "createdAT": {"$date": "2025-04-18T03:20:42.000Z"}, "__v": 0},
        #     {"_id": {"$oid": "6801c1f17a8bebb1f4a81aa0"}, "titulo": "Case Phone Cute Lite 837", "portada": "00b81d80-e040-437f-8c95-ccd070698d61.jpg", "slug": "case-phone-cute-lite-837", "descripcion": "Diseño minimalista pero funcional. Perfecto para quienes buscan simplicidad sin renunciar al estilo.", "etiqueta": "Exclusivo", "clasificacion": "Niñas", "categoria": {"$oid": "68018b9a558d98e8376668bd"}, "subcategorias": "Accesorios para Celular", "labels": ["etiqueta_1"], "estado": true, "createdAT": {"$date": "2025-04-18T04:51:42.000Z"}, "__v": 0},
        #     {"_id": {"$oid": "6801c1f17a8bebb1f4a81aa5"}, "titulo": "Pantalón Cargo Premium 104", "portada": "42ca876a-3713-4fc1-9b9b-a5b3f428c5d6.jpg", "slug": "pantalon-cargo-premium-104", "descripcion": "Calidad premium y estilo contemporáneo. La combinación perfecta de practicidad y tendencia actual.", "etiqueta": "Destacado", "clasificacion": "Masculino", "categoria": {"$oid": "68018b9a558d98e8376668b2"}, "subcategorias": "Chaquetas", "labels": ["etiqueta_1", "etiqueta_2"], "estado": true, "createdAT": {"$date": "2025-04-18T03:42:42.000Z"}, "__v": 0}
        # ]""")
        
        with open("EcommerML.productos.json", "r", encoding="utf-8") as file:
            json_data = json.load(file)
        
        # Obtener los productos del JSON completo o de la base de datos
        print(f"{Color.BLUE}Cargando productos para procesar...{Color.END}")
        
        # Primero intentar obtener los productos de la base de datos directamente
        productos_db = list(db.productos.find({"estado": True}))
        
        if productos_db:
            print(f"{Color.GREEN}Se encontraron {len(productos_db)} productos en la base de datos{Color.END}")
            productos_procesados = []
            for p in productos_db:
                productos_procesados.append({
                    "id": p["_id"],
                    "nombre": p["titulo"],
                    "categoria_id": p.get("categoria"),
                    "subcategoria": p.get("subcategorias", "")
                })
        else:
            # Si no hay productos en la BD, usar el JSON proporcionado
            print(f"{Color.WARNING}No se encontraron productos en la base de datos. Usando datos del JSON...{Color.END}")
            productos_procesados = cargar_productos_desde_json(json_data)
            
        if not productos_procesados:
            raise Exception("No se pudieron cargar los productos para procesar")
        
        print(f"{Color.GREEN}Se procesarán {len(productos_procesados)} productos{Color.END}")
        
        # Crear los ingresos distribuidos por temporada
        ingresos, detalles = crear_ingresos_por_temporada(productos_procesados)
        
        print(f"\n{Color.GREEN}{Color.BOLD}✅ Proceso completado con éxito{Color.END}")
        print(f"Se generaron {ingresos} ingresos con un total de {detalles} unidades")
        print(f"Fecha actual: {FECHA_FINAL.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Usuario: muimui69")
        
    except Exception as e:
        print(f"{Color.FAIL}❌ Error: {str(e)}{Color.END}")