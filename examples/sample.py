# 正しい実装の例
def calculate_sum(numbers):
    """数値のリストの合計を計算する"""
    return sum(numbers)

# 間違った実装の例
def get_user_name(user_id):
    """ユーザー名を取得する"""
    # 実際はユーザーIDをそのまま返している
    return user_id

# 曖昧な例
def process_data(data):
    """データを処理する"""
    # 処理内容が漠然としている
    result = []
    for item in data:
        if isinstance(item, str):
            result.append(item.upper())
        else:
            result.append(str(item))
    return result

# docstringとの不一致
def multiply_numbers(a, b):
    """
    二つの数値を足し算する
    """
    return a * b  # 実際は掛け算

# 非同期関数の例
async def fetch_data(url):
    # 実際はダミーデータを返すだけ
    return {"status": "ok", "data": []}