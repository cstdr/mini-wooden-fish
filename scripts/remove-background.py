#!/usr/bin/env python3
"""
木鱼图片背景去除脚本
功能：将木鱼图片的背景变为透明
"""

from PIL import Image
import os

def remove_background(input_path, output_path):
    """
    去除图片背景并保存为透明PNG
    """
    print(f"📖 读取图片: {input_path}")
    
    try:
        # 打开图片
        img = Image.open(input_path)
        print(f"✅ 图片打开成功")
        print(f"📐 尺寸: {img.size}")
        print(f"🎨 模式: {img.mode}")
        
        # 转换为 RGBA 模式（如果还不是）
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
            print(f"🔄 转换为 RGBA 模式")
        
        # 获取图片数据
        data = img.getdata()
        
        # 分析边缘颜色（假设边缘是背景）
        # 获取四个角的颜色
        corners = [
            img.getpixel((0, 0)),  # 左上
            img.getpixel((img.width - 1, 0)),  # 右上
            img.getpixel((0, img.height - 1)),  # 左下
            img.getpixel((img.width - 1, img.height - 1))  # 右下
        ]
        
        # 计算平均背景颜色
        avg_r = sum(c[0] for c in corners) // 4
        avg_g = sum(c[1] for c in corners) // 4
        avg_b = sum(c[2] for c in corners) // 4
        
        print(f"🎯 检测到背景颜色: RGB({avg_r}, {avg_g}, {avg_b})")
        
        # 容差值（可以根据实际情况调整）
        tolerance = 30
        
        # 创建新的像素数据
        new_data = []
        for item in data:
            r, g, b, a = item
            
            # 检查是否与背景颜色相似
            if (abs(r - avg_r) < tolerance and 
                abs(g - avg_g) < tolerance and 
                abs(b - avg_b) < tolerance):
                # 设置为完全透明
                new_data.append((r, g, b, 0))
            else:
                # 保留原始颜色，稍微提高透明度
                # 使用抗锯齿：如果颜色接近背景但不完全相同，逐渐过渡
                color_diff = max(abs(r - avg_r), abs(g - avg_g), abs(b - avg_b))
                if color_diff < tolerance * 1.5:
                    # 边缘区域：逐渐透明
                    alpha = int((color_diff / (tolerance * 1.5)) * 255)
                    new_data.append((r, g, b, alpha))
                else:
                    # 主体部分：完全不透明
                    new_data.append((r, g, b, 255))
        
        # 更新图片数据
        img.putdata(new_data)
        
        # 保存为 PNG
        print(f"💾 保存透明图片: {output_path}")
        img.save(output_path, 'PNG')
        
        # 检查文件大小
        file_size = os.path.getsize(output_path) / 1024
        print(f"✅ 完成！文件大小: {file_size:.2f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

if __name__ == "__main__":
    # 路径设置
    input_file = "../images/wooden-fish.png"
    output_file = "../images/wooden-fish-transparent.png"
    
    # 转换路径为绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, input_file)
    output_path = os.path.join(script_dir, output_file)
    
    print("=" * 50)
    print("🖼️ 木鱼图片背景去除工具")
    print("=" * 50)
    
    if os.path.exists(input_path):
        success = remove_background(input_path, output_path)
        if success:
            print("\n🎉 成功！透明背景图片已生成")
        else:
            print("\n😢 处理失败")
    else:
        print(f"❌ 文件不存在: {input_path}")
