from PIL import Image
import os
import sys

def get_image_details(image_path):
    """
    获取图片的尺寸和总像素数量。
    :param image_path: 图片文件的完整路径。
    """
    if not os.path.exists(image_path):
        print(f"错误：文件未找到 - {image_path}")
        return

    try:
        # 1. 打开图片
        img = Image.open(image_path)

        # 2. 获取尺寸 (宽度, 高度)
        width, height = img.size
        
        # 3. 计算总像素
        total_pixels = width * height

        print(f"\n--- 图片信息 ---")
        print(f"文件名: {os.path.basename(image_path)}")
        print(f"格式: {img.format}")
        print(f"--- 尺寸 (Resolution) ---")
        print(f"宽度 (Width): {width} 像素")
        print(f"高度 (Height): {height} 像素")
        print(f"--- 像素数量 (Total Pixels) ---")
        print(f"总像素: {total_pixels:,} 像素") # 使用逗号分隔符
        print(f"------------------\n")

    except IOError:
        print(f"错误：无法打开或处理图片文件 - {image_path}")
    except Exception as e:
        print(f"发生未知错误: {e}")

# --- 主程序入口 ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("请提供图片文件的路径。")
        print("用法: python image_info_checker.py <图片路径>")
        # 示例用法，您可以将这个路径替换为您电脑上的任意图片
        # example_path = "C:\\Users\\YourName\\Pictures\\test.jpg"
        # print(f"例如: python image_info_checker.py \"{example_path}\"")
    else:
        # 获取用户在命令行输入的第一个参数作为图片路径
        image_file = sys.argv[1]
        get_image_details(image_file)