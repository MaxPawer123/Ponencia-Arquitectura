import qrcode
from qrcode.constants import ERROR_CORRECT_H

def generar_qr(enlace, nombre_archivo="qr_code.png", tamanio=10, nivel_correccion=ERROR_CORRECT_H):
    """
    Genera un código QR a partir de un enlace
    
    Args:
        enlace (str): URL o texto a codificar
        nombre_archivo (str): Nombre del archivo de salida
        tamanio (int): Tamaño del código QR (box_size)
        nivel_correccion (int): Nivel de corrección de errores
    """
    # Crear objeto QR
    qr = qrcode.QRCode(
        version=None,  # Automático
        error_correction=nivel_correccion,
        box_size=tamanio,
        border=4,
    )
    
    # Agregar datos
    qr.add_data(enlace)
    qr.make(fit=True)
    
    # Crear imagen
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Guardar archivo
    img.save(nombre_archivo)
    print(f"✅ QR generado exitosamente: {nombre_archivo}")
    print(f"📎 Enlace: {enlace}")
    
    return img

# Ejemplo de uso
if __name__ == "__main__":
    # Cambia este enlace por el que quieras
    url = "https://n9.cl/oczs0 "
    generar_qr(url, "yapu_aroma.png")