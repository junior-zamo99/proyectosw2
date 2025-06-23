import pymongo
import random
import string
import bcrypt
from datetime import datetime, timedelta
from bson.objectid import ObjectId

# Conexión a MongoDB
uri = "mongodb+srv://houwenvt:will@cluster0.crz8eun.mongodb.net/EcommerML?retryWrites=true&w=majority"
client = pymongo.MongoClient(uri)
db = client["EcommerML"]

# Fecha de referencia actual
fecha_base = datetime(2025, 4, 19, 14, 18, 7)

# Listas de nombres
nombres_masculinos = [
    "Juan", "Carlos", "Roberto", "Miguel", "Pedro", "José", "David", "Daniel", "Alejandro",
    "Fernando", "Luis", "Jorge", "Andrés", "Rafael", "Francisco", "Gabriel", "Javier",
    "Antonio", "Sergio", "Manuel", "Oscar", "Enrique", "Martín", "Eduardo", "Ricardo",
    "Raúl", "Hugo", "Gonzalo", "Diego", "Arturo", "Mario", "Víctor", "Julio", "César",
    "Alfredo", "Alberto", "Ernesto", "Pablo", "Marcos", "Salvador", "Rubén", "Armando"
]

nombres_femeninos = [
    "María", "Ana", "Laura", "Sofía", "Carmen", "Patricia", "Isabel", "Luisa", "Gabriela",
    "Rosa", "Martha", "Daniela", "Claudia", "Mónica", "Silvia", "Elena", "Adriana", "Diana",
    "Julia", "Beatriz", "Valeria", "Natalia", "Teresa", "Susana", "Carolina", "Victoria",
    "Alicia", "Pilar", "Mariana", "Cristina", "Lucía", "Alejandra", "Verónica", "Leticia",
    "Juana", "Antonia", "Fernanda", "Guadalupe", "Cecilia", "Lourdes", "Catalina", "Camila"
]

apellidos = [
    "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez",
    "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez",
    "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos",
    "Gil", "Ramírez", "Serrano", "Blanco", "Molina", "Morales", "Suárez", "Ortega", "Delgado",
    "Castro", "Ortiz", "Rubio", "Marín", "Sanz", "Núñez", "Iglesias", "Medina", "Garrido",
    "Cortés", "Castillo", "Santos", "Lozano", "Guerrero", "Cano", "Prieto", "Méndez",
    "Cruz", "Calvo", "Gallego", "Vidal", "León", "Márquez", "Herrera", "Peña", "Flores",
    "Cabrera", "Campos", "Vega", "Fuentes", "Carrasco", "Díez", "Caballero", "Reyes",
    "Nieto", "Pascual", "Herrero", "Santana", "Lorenzo", "Montero", "Hidalgo", "Giménez",
    "Ibáñez", "Ferrer", "Duran", "Vicente", "Benítez", "Mora", "Santiago", "Arias",
    "Vargas", "Carmona", "Crespo", "Román", "Pastor", "Soto", "Sáez", "Velasco", "Soler",
    "Moya", "Esteban", "Parra", "Bravo", "Gallardo", "Rojas"
]

dominios = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com", 
           "protonmail.com", "live.com", "aol.com", "zoho.com", "mail.com"]

def generar_password_hash(longitud=5):
    """Genera una contraseña aleatoria y devuelve su hash con bcrypt"""
    caracteres = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(caracteres) for _ in range(longitud))
    
    # Hash usando bcrypt
    salt = bcrypt.gensalt(10)
    hash_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    return hash_password.decode('utf-8')

def generar_email(nombre, apellido):
    """Genera un email basado en el nombre y apellido con diferentes formatos"""
    nombre = nombre.lower()
    apellido = apellido.lower()
    
    formato = random.randint(1, 8)
    dominio = random.choice(dominios)
    
    if formato == 1:
        return f"{nombre}.{apellido}@{dominio}"
    elif formato == 2:
        return f"{nombre}{random.randint(1, 999)}@{dominio}"
    elif formato == 3:
        return f"{nombre[0]}{apellido}@{dominio}"
    elif formato == 4:
        return f"{apellido}.{nombre}@{dominio}"
    elif formato == 5:
        return f"{apellido}{nombre[0]}@{dominio}"
    elif formato == 6:
        return f"{nombre}_{apellido}@{dominio}"
    elif formato == 7:
        año = random.randint(70, 99)
        return f"{nombre}{apellido}{año}@{dominio}"
    else:
        return f"{nombre}{apellido}{random.randint(1, 999)}@{dominio}"

def generar_fechas_realistas(cantidad_total):
    """
    Genera fechas de creación con distribución realista incluyendo eventos especiales
    """
    # Fechas especiales (día, mes, año, nombre, % del mes)
    eventos_especiales = [
        # Formato: (día, mes, año, "nombre evento", % del total mensual)
        (29, 11, 2024, "Black Friday", 0.40),        # 40% del mes concentrado en este día
        (2, 12, 2024, "Cyber Monday", 0.25),         # 25% del mes concentrado en este día
        (6, 1, 2025, "Día de Reyes", 0.15),          # 15% del mes concentrado en este día
        (14, 2, 2025, "Día San Valentín", 0.20),     # 20% del mes concentrado en este día
        (3, 3, 2025, "Lunes de Carnaval", 0.30),     # 30% del mes concentrado en este día
        (4, 3, 2025, "Martes de Carnaval", 0.20),    # 20% del mes concentrado en este día
    ]
    
    # Distribución por mes (porcentajes)
    distribucion_mensual = {
        (2024, 7): 0.30,  # Julio - pico principal
        (2024, 8): 0.04,  # Agosto - bajo
        (2024, 9): 0.05,  # Septiembre
        (2024, 10): 0.04, # Octubre 
        (2024, 11): 0.08, # Noviembre (incluye Black Friday)
        (2024, 12): 0.20, # Diciembre (incluye Cyber Monday + Navidad)
        (2025, 1): 0.05,  # Enero (incluye Día de Reyes)
        (2025, 2): 0.12,  # Febrero - inicio de clases
        (2025, 3): 0.10,  # Marzo - carnaval
        (2025, 4): 0.02,  # Abril (parcial hasta día 19)
    }
    
    # Calcular número base de clientes por mes
    clientes_por_mes = {}
    for (año, mes), proporcion in distribucion_mensual.items():
        clientes_por_mes[(año, mes)] = int(cantidad_total * proporcion)
    
    # Ajustar para asegurarse que sumen exactamente el total
    diferencia = cantidad_total - sum(clientes_por_mes.values())
    if diferencia > 0:
        # Añadir los clientes faltantes al mes con más registros (julio)
        clientes_por_mes[(2024, 7)] += diferencia
    
    # Generar las fechas para cada cliente
    fechas_creacion = []
    
    for (año, mes), num_clientes in clientes_por_mes.items():
        # Calcular clientes asignados a eventos especiales este mes
        clientes_eventos_especiales = 0
        eventos_del_mes = [e for e in eventos_especiales if e[1] == mes and e[2] == año]
        
        # Diccionario para asignar clientes a días específicos
        clientes_por_dia = {}
        
        # Asignar clientes a eventos especiales
        for dia, _, _, nombre_evento, proporcion_evento in eventos_del_mes:
            clientes_evento = int(num_clientes * proporcion_evento)
            clientes_eventos_especiales += clientes_evento
            clientes_por_dia[dia] = clientes_evento
        
        # Clientes restantes para distribución normal
        clientes_restantes = num_clientes - clientes_eventos_especiales
        
        # Obtener los días del mes
        if mes == 2:
            if (año % 4 == 0 and año % 100 != 0) or (año % 400 == 0):
                dias_en_mes = 29
            else:
                dias_en_mes = 28
        elif mes in [4, 6, 9, 11]:
            dias_en_mes = 30
        else:
            dias_en_mes = 31
            
        # Limitar a día actual para abril 2025
        if año == 2025 and mes == 4:
            dias_en_mes = 19
            
        # Distribuir clientes de eventos especiales
        for dia, cantidad in clientes_por_dia.items():
            for _ in range(cantidad):
                # Generar hora con preferencia por la tarde/noche
                hora_rand = random.random()
                if hora_rand < 0.05:  # 5% en madrugada
                    hora = random.randint(0, 7)
                elif hora_rand < 0.25:  # 20% en mañana
                    hora = random.randint(8, 11)
                elif hora_rand < 0.55:  # 30% en tarde
                    hora = random.randint(12, 17)
                else:  # 45% en noche
                    hora = random.randint(18, 23)
                    
                minuto = random.randint(0, 59)
                segundo = random.randint(0, 59)
                
                fecha = datetime(año, mes, dia, hora, minuto, segundo)
                fechas_creacion.append(fecha)
            
        # Distribuir clientes restantes, con preferencia para fines de semana
        for _ in range(clientes_restantes):
            # Generar día aleatorio
            dia = random.randint(1, dias_en_mes)
            
            # Verificar si es fin de semana
            fecha_tentativa = datetime(año, mes, dia)
            dia_semana = fecha_tentativa.weekday()  # 0-4 es lunes-viernes, 5-6 es sábado-domingo
            
            # Determinar si es cerca de quincena o fin de mes (días de pago)
            es_dia_pago = (1 <= dia <= 5) or (15 <= dia <= 20)
            
            # Generar hora con preferencia por la tarde/noche
            hora_rand = random.random()
            if hora_rand < 0.05:  # 5% en madrugada
                hora = random.randint(0, 7)
            elif hora_rand < 0.25:  # 20% en mañana
                hora = random.randint(8, 11)
            elif hora_rand < 0.55:  # 30% en tarde
                hora = random.randint(12, 17)
            else:  # 45% en noche
                hora = random.randint(18, 23)
                
            minuto = random.randint(0, 59)
            segundo = random.randint(0, 59)
            
            fecha = datetime(año, mes, dia, hora, minuto, segundo)
            fechas_creacion.append(fecha)
            
    # Ordenar por fecha
    fechas_creacion.sort()
    
    return fechas_creacion

def generar_clientes(cantidad=50):
    """Genera una lista de documentos de clientes ficticios"""
    clientes = []
    
    # Generar todas las fechas de creación previamente
    fechas_creacion = generar_fechas_realistas(cantidad)
    
    for i in range(cantidad):
        # Determinar género para nombres coherentes
        genero = random.choice(["M", "F"])
        
        # Generar 1 o 2 nombres según género
        if genero == "M":
            num_nombres = random.randint(1, 2)
            lista_nombres = random.sample(nombres_masculinos, num_nombres)
            nombres = " ".join(lista_nombres)
        else:
            num_nombres = random.randint(1, 2)
            lista_nombres = random.sample(nombres_femeninos, num_nombres)
            nombres = " ".join(lista_nombres)
        
        # Generar 1 o 2 apellidos
        num_apellidos = random.randint(1, 2)
        lista_apellidos = random.sample(apellidos, num_apellidos)
        apellidos_cliente = " ".join(lista_apellidos)
        
        # Crear email
        email = generar_email(lista_nombres[0], lista_apellidos[0])
        
        # Password hasheada
        password_hash = generar_password_hash()
        
        # Fullname
        fullname = f"{nombres} {apellidos_cliente}"
        
        # Fecha de creación de la lista pre-generada
        fecha_creacion = fechas_creacion[i]
        
        # Email validación (90% validado)
        email_validacion = random.choices([True, False], weights=[0.9, 0.1])[0]
        
        # Estado (95% activo)
        estado = random.choices([True, False], weights=[0.95, 0.05])[0]
        
        # Crear documento de cliente 
        cliente = {
            "_id": ObjectId(),
            "nombres": nombres,
            "apellidos": apellidos_cliente,
            "email": email,
            "email_validacion": email_validacion,
            "password": password_hash,
            "estado": estado,
            "fullname": fullname,
            "createdAT": fecha_creacion,
            "__v": 0
        }
        
        clientes.append(cliente)
    
    return clientes

def insertar_clientes(clientes):
    """Inserta los clientes en la base de datos MongoDB"""
    if not clientes:
        print("No hay clientes para insertar.")
        return
    
    try:
        resultado = db.clientes.insert_many(clientes)
        print(f"Se insertaron {len(resultado.inserted_ids)} clientes correctamente.")
    except Exception as e:
        print(f"Error al insertar clientes: {str(e)}")

def mostrar_estadisticas(clientes):
    """Muestra estadísticas de los clientes generados"""
    total = len(clientes)
    validados = sum(1 for c in clientes if c["email_validacion"])
    activos = sum(1 for c in clientes if c["estado"])
    
    print("\n=== ESTADÍSTICAS DE CLIENTES GENERADOS ===")
    print(f"Total de clientes: {total}")
    print(f"Clientes con email validado: {validados} ({validados/total*100:.1f}%)")
    print(f"Clientes activos: {activos} ({activos/total*100:.1f}%)")
    
    # Distribución por meses
    meses = {}
    for cliente in clientes:
        mes = cliente["createdAT"].strftime("%Y-%m")
        if mes not in meses:
            meses[mes] = 0
        meses[mes] += 1
    
    print("\nDistribución por fecha de registro:")
    for mes, cantidad in sorted(meses.items()):
        print(f"  {mes}: {cantidad} clientes ({cantidad/total*100:.1f}%)")
        
    # Distribución por eventos específicos (verificando días clave)
    eventos = {
        "Black Friday (29/11/2024)": 0,
        "Cyber Monday (02/12/2024)": 0,
        "Día de Reyes (06/01/2025)": 0,
        "San Valentín (14/02/2025)": 0,
        "Carnaval (03-04/03/2025)": 0
    }
    
    for cliente in clientes:
        fecha = cliente["createdAT"]
        if fecha.day == 29 and fecha.month == 11 and fecha.year == 2024:
            eventos["Black Friday (29/11/2024)"] += 1
        elif fecha.day == 2 and fecha.month == 12 and fecha.year == 2024:
            eventos["Cyber Monday (02/12/2024)"] += 1
        elif fecha.day == 6 and fecha.month == 1 and fecha.year == 2025:
            eventos["Día de Reyes (06/01/2025)"] += 1
        elif fecha.day == 14 and fecha.month == 2 and fecha.year == 2025:
            eventos["San Valentín (14/02/2025)"] += 1
        elif (fecha.day in [3, 4]) and fecha.month == 3 and fecha.year == 2025:
            eventos["Carnaval (03-04/03/2025)"] += 1
    
    print("\nDistribución por eventos específicos:")
    for evento, cantidad in eventos.items():
        if cantidad > 0:
            print(f"  {evento}: {cantidad} clientes")

if __name__ == "__main__":
    try:
        cantidad = int(input("¿Cuántos clientes deseas generar? "))
    except ValueError:
        cantidad = 50
        print(f"Entrada inválida, se generarán {cantidad} clientes por defecto.")
    
    print(f"Generando {cantidad} clientes ficticios...")
    clientes = generar_clientes(cantidad)
    
    # Mostrar estadísticas
    mostrar_estadisticas(clientes)
    
    # Preguntar si quiere insertar en la base de datos
    respuesta = input("\n¿Deseas insertar estos clientes en la base de datos? (s/n): ").lower()
    
    if respuesta == 's' or respuesta == 'si':
        insertar_clientes(clientes)
        print("Operación completada.")
    else:
        print("Operación cancelada.")
