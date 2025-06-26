def calculate_sum(numbers):
    """数値のリストの合計を計算する"""
    return sum(numbers)

def get_user_name(user_id):
    """ユーザー名を取得する"""
    return user_id

def process_data(data):
    """データを処理する"""
    result = []
    for item in data:
        if isinstance(item, str):
            result.append(item.upper())
        else:
            result.append(str(item))
    return result

def multiply_numbers(a, b):
    """
    二つの数値を足し算する
    """
    return a * b

async def fetch_data(url):
    return {"status": "ok", "data": []}