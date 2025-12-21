from PIL import Image
import sys

def remove_white_background(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully saved transparent image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_white_background(
        r"c:\Users\Brécheteau\Desktop\Site Web\Site Champs de Chronon\Chronon Field\chronon-field-main\public\signature.png",
        r"c:\Users\Brécheteau\Desktop\Site Web\Site Champs de Chronon\Chronon Field\chronon-field-main\public\signature_transparent.png"
    )
