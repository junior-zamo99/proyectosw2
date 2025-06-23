#!/usr/bin/env python3
import json
import pandas as pd
import numpy as np
from datetime import datetime
from collections import Counter
import os
import pytz  # Agregado para manejar zonas horarias

#######################################################
# CONFIGURA AQUÍ LAS RUTAS DE TUS ARCHIVOS JSON
#######################################################

VENTAS_PATH = "ventaswill.json"            # Ruta al archivo de ventas
CLIENTES_PATH = "clienteswill.json"        # Ruta al archivo de clientes
VENTAS_DETALLE_PATH = "ventasdetallewill.json"  # Ruta al archivo de detalle de ventas
PRODUCTOS_PATH = "productoswill.json"      # Ruta al archivo de productos
OUTPUT_PATH = "clientes_rfm_enriquecido.csv"    # Nombre del archivo CSV a generar

#######################################################

def main():
    print("=== EXTRACCIÓN DE DATOS PARA SEGMENTACIÓN DE CLIENTES ===")
    print("Iniciando proceso de extracción...")
    
    # 1. Cargar datos de archivos JSON
    try:
        print(f"\nLeyendo archivos JSON:")
        print(f"- Ventas: {VENTAS_PATH}")
        with open(VENTAS_PATH, 'r', encoding='utf-8') as f:
            ventas_data = json.load(f)
        
        print(f"- Clientes: {CLIENTES_PATH}")
        with open(CLIENTES_PATH, 'r', encoding='utf-8') as f:
            clientes_data = json.load(f)
        
        print(f"- Detalles de Ventas: {VENTAS_DETALLE_PATH}")
        with open(VENTAS_DETALLE_PATH, 'r', encoding='utf-8') as f:
            ventas_detalle_data = json.load(f)
        
        print(f"- Productos: {PRODUCTOS_PATH}")
        with open(PRODUCTOS_PATH, 'r', encoding='utf-8') as f:
            productos_data = json.load(f)
        
        print("Todos los archivos cargados exitosamente.")
    except FileNotFoundError as e:
        print(f"ERROR: No se encontró el archivo: {e}")
        return
    except json.JSONDecodeError as e:
        print(f"ERROR: Formato JSON inválido: {e}")
        return
    except Exception as e:
        print(f"ERROR al cargar archivos: {e}")
        return
    
    # 2. Convertir a DataFrames
    print("\nConvirtiendo datos a formato de trabajo...")
    ventas_df = pd.DataFrame(ventas_data)
    clientes_df = pd.DataFrame(clientes_data)
    ventas_detalle_df = pd.DataFrame(ventas_detalle_data)
    productos_df = pd.DataFrame(productos_data)
    
    # 3. Extraer IDs a formato simple
    print("Procesando identificadores...")
    ventas_df['cliente_id'] = ventas_df['cliente'].apply(lambda x: x['$oid'])
    ventas_df['venta_id'] = ventas_df['_id'].apply(lambda x: x['$oid'])
    clientes_df['cliente_id'] = clientes_df['_id'].apply(lambda x: x['$oid'])
    ventas_detalle_df['venta_id'] = ventas_detalle_df['venta'].apply(lambda x: x['$oid'])
    ventas_detalle_df['producto_id'] = ventas_detalle_df['producto'].apply(lambda x: x['$oid'])
    productos_df['producto_id'] = productos_df['_id'].apply(lambda x: x['$oid'])
    
    # 4. Convertir fechas y filtrar ventas válidas
    print("Procesando fechas y filtrando ventas...")
    ventas_df['fecha'] = pd.to_datetime(ventas_df['createdAT'].apply(lambda x: x['$date']))
    
    # Importante: Eliminar la información de zona horaria para evitar problemas
    ventas_df['fecha'] = ventas_df['fecha'].dt.tz_localize(None)
    
    ventas_df_filtrada = ventas_df[ventas_df['estado'].isin(['Procesado', 'Confirmado'])]
    
    total_ventas = len(ventas_df)
    ventas_validas = len(ventas_df_filtrada)
    print(f"Total de ventas: {total_ventas}")
    print(f"Ventas válidas (Procesado/Confirmado): {ventas_validas} ({ventas_validas/total_ventas*100:.1f}%)")
    
    if ventas_validas == 0:
        print("ERROR: No hay ventas válidas para procesar.")
        return
    
    # 5. Preparar datos de productos para enriquecimiento
    print("\nEnriqueciendo datos con información de productos...")
    # Extraer categoría desde el ObjectId
    if 'categoria' in productos_df.columns and isinstance(productos_df['categoria'].iloc[0], dict):
        productos_df['categoria_id'] = productos_df['categoria'].apply(lambda x: x['$oid'] if isinstance(x, dict) and '$oid' in x else None)
    
    # Crear un dataframe reducido con información relevante de productos
    productos_reducido = productos_df[['producto_id', 'clasificacion', 'subcategorias', 'titulo']].copy()
    
    # 6. Unir detalle de ventas con productos
    print("Vinculando detalles de ventas con información de productos...")
    ventas_detalle_con_info = ventas_detalle_df.merge(
        productos_reducido, 
        on='producto_id', 
        how='left'
    )
    
    # 7. Calcular métricas RFM y preferencias por cliente
    print("\nCalculando métricas RFM y preferencias por cliente...")
    
    # Fecha actual para cálculo de recencia (sin zona horaria para que coincida con las fechas procesadas)
    fecha_actual = datetime.now()
    print(f"Fecha de referencia para cálculo de recencia: {fecha_actual}")
    
    # Inicializar datos RFM
    rfm_data = []
    
    # Agrupar ventas por cliente
    cliente_grupos = ventas_df_filtrada.groupby('cliente_id')
    
    # Diccionario para almacenar preferencias de cada cliente
    preferencias_cliente = {}
    
    # Para cada cliente, inicializar diccionario de preferencias
    for cliente_id in ventas_df_filtrada['cliente_id'].unique():
        preferencias_cliente[cliente_id] = {
            'clasificaciones': [],
            'subcategorias': [],
            'productos': []
        }
    
    # Procesar detalles de ventas para obtener preferencias
    print("Analizando preferencias de compra...")
    
    # Unir detalles con información de ventas para tener cliente_id
    ventas_detalle_completo = ventas_detalle_con_info.merge(
        ventas_df_filtrada[['venta_id', 'cliente_id']], 
        on='venta_id',
        how='inner'
    )
    
    # Agrupar por cliente y producto para calcular frecuencia de compra por producto
    producto_por_cliente = ventas_detalle_completo.groupby(['cliente_id', 'producto_id']).agg({
        'cantidad': 'sum',
        'precio': 'sum'
    }).reset_index()
    
    # Añadir información de producto
    producto_por_cliente = producto_por_cliente.merge(
        productos_reducido,
        on='producto_id',
        how='left'
    )
    
    # Para cada cliente, encontrar productos más comprados
    for cliente_id, grupo in producto_por_cliente.groupby('cliente_id'):
        if not cliente_id in preferencias_cliente:
            continue
            
        # Top clasificaciones
        if 'clasificacion' in grupo.columns:
            clasificaciones = grupo['clasificacion'].tolist()
            preferencias_cliente[cliente_id]['clasificaciones'] = clasificaciones
        
        # Top subcategorías
        if 'subcategorias' in grupo.columns:
            subcategorias = grupo['subcategorias'].tolist()
            preferencias_cliente[cliente_id]['subcategorias'] = subcategorias
        
        # Top productos
        if len(grupo) > 0 and 'titulo' in grupo.columns:
            # Ordenar por cantidad comprada
            top_productos = grupo.sort_values('cantidad', ascending=False)
            preferencias_cliente[cliente_id]['productos'] = top_productos['titulo'].tolist()
    
    # 8. Calcular métricas RFM y compilar datos finales
    print("Compilando datos RFM finales...")
    
    for cliente_id, grupo in cliente_grupos:
        # Encontrar cliente en el dataframe de clientes
        cliente = clientes_df[clientes_df['cliente_id'] == cliente_id]
        if len(cliente) == 0:
            continue  # Saltar si no se encuentra el cliente
            
        # Calcular métricas RFM básicas
        ultima_compra = grupo['fecha'].max()
        # CORREGIDO: Ahora ambas fechas son tz-naive
        recencia_dias = (fecha_actual - ultima_compra).days
        frecuencia = len(grupo)  # Número de compras
        monetario = grupo['total'].sum()  # Suma total de compras
        valor_promedio = monetario / frecuencia
        
        # Obtener datos del cliente
        email = cliente['email'].values[0] if 'email' in cliente.columns else None
        nombre = cliente['fullname'].values[0] if 'fullname' in cliente.columns else None
        
        # Obtener preferencias
        pref = preferencias_cliente.get(cliente_id, {})
        
        # Top clasificación (categoría principal)
        clasificaciones = pref.get('clasificaciones', [])
        top_clasificacion = Counter(clasificaciones).most_common(1)[0][0] if clasificaciones else None
        
        # Top subcategoría
        subcategorias = pref.get('subcategorias', [])
        top_subcategoria = Counter(subcategorias).most_common(1)[0][0] if subcategorias else None
        
        # Top 3 productos
        productos = pref.get('productos', [])
        top_productos = ', '.join(productos[:3]) if productos else None
        
        # Guardar datos RFM enriquecidos
        rfm_data.append({
            'cliente_id': cliente_id,
            'email': email,
            'nombre': nombre,
            'ultima_compra': ultima_compra,
            'recencia_dias': recencia_dias,
            'num_compras': frecuencia,
            'total_gastado': monetario,
            'valor_promedio': valor_promedio,
            'clasificacion_preferida': top_clasificacion,
            'subcategoria_preferida': top_subcategoria,
            'top_productos': top_productos
        })
    
    # 9. Convertir a DataFrame y guardar como CSV
    rfm_df = pd.DataFrame(rfm_data)
    
    # Ordenar por valor total gastado (descendente)
    rfm_df = rfm_df.sort_values('total_gastado', ascending=False)
    
    # Guardar como CSV
    rfm_df.to_csv(OUTPUT_PATH, index=False)
    
    # 10. Mostrar resumen y estadísticas
    print(f"\n=== RESULTADOS ===")
    print(f"Se generaron datos RFM para {len(rfm_df)} clientes")
    print(f"Archivo guardado como: {OUTPUT_PATH}")
    
    print("\nEstadísticas descriptivas de las métricas RFM:")
    stats = rfm_df[['recencia_dias', 'num_compras', 'total_gastado', 'valor_promedio']].describe()
    print(stats)
    
    if len(rfm_df) > 0:
        print("\nDistribución de clasificaciones preferidas:")
        if rfm_df['clasificacion_preferida'].notna().any():
            print(rfm_df['clasificacion_preferida'].value_counts().head(5))  # Top 5
        else:
            print("No hay datos suficientes")
        
        print("\nDistribución de subcategorías preferidas:")
        if rfm_df['subcategoria_preferida'].notna().any():
            print(rfm_df['subcategoria_preferida'].value_counts().head(5))  # Top 5
        else:
            print("No hay datos suficientes")
    
    print("\n=== PROCESO COMPLETADO EXITOSAMENTE ===")
    print(f"Los datos están listos para su análisis en Google Colab")

if __name__ == "__main__":
    main()