#!/usr/bin/env python3
"""
木棍图片处理脚本
功能：
1. 去除背景并变透明
2. 旋转180度（头在左上角，尾在右下角）
"""

from PIL import Image
import os

def process_wooden_stick(input_path, output_path):
    """
    处理木棍图片：
    1. 去除背景
    2. 旋转180度
    """
    print(f"📖 读取图片: {input_path}")
    
    try:
        # 打开图片
        img = Image.open(input_path)
        print(f"✅ 图片打开成功")
        print(f"📐 原始尺寸: {img.size}")
        print(f"🎨 模式: {img.mode}")
        
        # 转换为 RGBA 模式
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
            print(f"🔄 转换为 RGBA 模式")
        
        # 步骤1：去除背景
        data = img.getdata()
        
        # 获取边缘颜色
        corners = [
            img.getpixel((0, 0)),
            img.getpixel((img.width - 1, 0)),
            img.getpixel((0, img.height - 1)),
            img.getpixel((img.width - 1, img.height - 1))
        ]
        
        avg_r = sum(c[0] for c in corners) // 4
        avg_g = sum(c[1] for c in corners) // 4
        avg_b = sum(c[2] for c in corners) // 4
        
        print(f"🎯 检测到背景颜色: RGB({avg_r}, {avg_g}, {avg_b})")
        
        # 容差值
        tolerance = 30
        
        # 创建新的像素数据
        new_data = []
        for item in data:
            r, g, b, a = item
            
            # 检查是否与背景颜色相似
            if (abs(r - avg_r) < tolerance and 
                abs(g - avg_g) < tolerance and 
                abs(b - avg_b) < tolerance):
                new_data.append((r, g, b, 0))  # 完全透明
            else:
                color_diff = max(abs(r - avg_r), abs(g - avg_g), abs(b - avg_b))
                if color_diff < tolerance * 1.5:
                    alpha = int((color_diff / (tolerance * 1.5)) * 255)
                    new_data.append((r, g, b, alpha))
                else:
                    new_data.append((r, g, b, 255))  # 完全不透明
        
        img.putdata(new_data)
        print(f"✅ 背景去除完成")
        
        # 步骤2：旋转180度（头在左上角，尾在右下角）
        print(f"🔄 旋转图片180度...")
        img = img.rotate(180, expand=True)
        print(f"✅ 旋转完成")
        print(f"📐 新尺寸: {img.size}")
        
        # 保存
        print(f"💾 保存为PNG...")
        img.save(output_path, 'PNG', optimize=True)
        
        # 检查文件大小
        file_size = os.path.getsize(output_path) / 1024
        print(f"✅ 完成！文件大小: {file_size:.2f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # 路径设置
    input_file = "../images/wooden.png"
    output_file = "../images/wooden-transparent-rotated.png"
    
    # 转换路径为绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, input_file)
    output_path = os.path.join(script_dir, output_file)
    
    print("=" * 60)
    print("🪵 木棍图片处理工具")
    print("=" * 60)
    print("功能：1. 去除背景  2. 旋转180度")
    print("=" * 60)
    
    if os.path.exists(input_path):
        success = process_wooden_stick(input_path, output_path)
        if success:
            print("\n🎉 成功！已生成处理后的木棍图片")
            print(f"📁 输出文件: {output_path}")
        else:
            print("\n😢 处理失败")
    else:
        print(f"❌ 文件不存在: {input_path}")
