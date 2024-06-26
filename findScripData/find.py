import os
import shutil
import xml.etree.ElementTree as ET

def delete_files(folder_path):
    namespace = {"alto": "http://www.loc.gov/standards/alto/ns-v4#"}
    valid_folder_path = folder_path + "_valid"
    valid_folder_path_no_poly = folder_path + "_valid_no_poly"
    os.makedirs(valid_folder_path, exist_ok=True)
    os.makedirs(valid_folder_path_no_poly, exist_ok=True)

    for filename in os.listdir(folder_path):
        if filename.endswith(".xml"):
            xml_file_path = os.path.join(folder_path, filename)
            image_file_path = os.path.join(folder_path,
                                           filename.replace(".xml", ".jpg"))
            
            tree = ET.parse(xml_file_path)
            root = tree.getroot()

            textLines = root.findall(".//alto:TextLine", namespaces=namespace)
            if not textLines:
                print(f"No information found in {xml_file_path}")
                continue

            polygons = root.findall(".//alto:Polygon", namespaces=namespace)
            if not polygons:
                print(f"No Polygon elements found in {xml_file_path}")
                print(f"Copying {xml_file_path} and {image_file_path}")
                shutil.copy(xml_file_path, os.path.join(
                    valid_folder_path_no_poly, filename))
                if os.path.exists(image_file_path):
                    shutil.copy(image_file_path, os.path.join(
                        valid_folder_path_no_poly, 
                        filename.replace(".xml", ".jpg")))
            else:
                valid = True
                
                for polygon in polygons:
                    points = polygon.get("POINTS", "")
                    points_list = points.split()
                    if len(points_list) != 8:
                        valid = False
                        print(f"Not valid: {points_list} in {xml_file_path}")
                        break
                
                if valid:
                    print(f"Copying {xml_file_path} and {image_file_path}")
                    shutil.copy(xml_file_path, os.path.join(valid_folder_path, 
                                                            filename))
                    if os.path.exists(image_file_path):
                        shutil.copy(image_file_path, os.path.join(
                            valid_folder_path, 
                            filename.replace(".xml", ".jpg")))

if __name__ == "__main__":
    folder_path = input("Please enter the folder path: ")
    delete_files(folder_path)
    print("Processing completed.")
