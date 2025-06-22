import asyncio
from datetime import datetime
from typing import List, Dict, Optional, Any
from functools import wraps
import time

# デコレータの例
def measure_time(func):
    """実行時間を計測するデコレータ"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

def validate_email(email: str) -> bool:
    """メールアドレスの妥当性を検証"""
    return "@" in email and "." in email.split("@")[1]

def normalize_phone(phone: str) -> str:
    """電話番号を正規化"""
    return "".join(filter(str.isdigit, phone))

# 複雑な例1: 複数の処理を含む関数
@measure_time
def process_customer_order(customer_data: Dict[str, Any], items: List[Dict]) -> Dict:
    """
    顧客の注文を処理する
    """
    # 実際は注文処理だけでなく、在庫確認、価格計算、ポイント付与も行う
    
    # 顧客データの検証
    if not validate_email(customer_data.get("email", "")):
        raise ValueError("Invalid email address")
    
    # 在庫確認（本来は別の責務）
    available_items = []
    unavailable_items = []
    
    for item in items:
        if item.get("stock", 0) > item.get("quantity", 1):
            available_items.append(item)
        else:
            unavailable_items.append(item)
    
    # 価格計算
    subtotal = sum(item["price"] * item["quantity"] for item in available_items)
    tax = subtotal * 0.1
    total = subtotal + tax
    
    # ポイント計算（副作用）
    points_earned = int(total * 0.01)
    customer_data["points"] = customer_data.get("points", 0) + points_earned
    
    # 注文オブジェクトの作成
    order = {
        "order_id": f"ORD-{int(time.time())}",
        "customer": customer_data,
        "items": available_items,
        "unavailable_items": unavailable_items,
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "points_earned": points_earned,
        "created_at": datetime.now().isoformat()
    }
    
    # ログ出力（副作用）
    print(f"Order {order['order_id']} processed for {customer_data['email']}")
    
    return order

# 複雑な例2: 名前が曖昧な関数
def analyze_data(data_list: List[Dict]) -> Dict:
    """
    データを分析する
    """
    # 実際は分析だけでなく、クレンジング、集計、予測も行っている
    
    # データクレンジング
    cleaned_data = []
    for item in data_list:
        if item.get("value") is not None and isinstance(item["value"], (int, float)):
            cleaned_data.append(item)
    
    if not cleaned_data:
        return {"error": "No valid data"}
    
    # 基本統計
    values = [item["value"] for item in cleaned_data]
    stats = {
        "count": len(values),
        "sum": sum(values),
        "mean": sum(values) / len(values),
        "min": min(values),
        "max": max(values)
    }
    
    # トレンド分析（移動平均）
    if len(values) >= 3:
        moving_avg = []
        for i in range(2, len(values)):
            avg = sum(values[i-2:i+1]) / 3
            moving_avg.append(avg)
        stats["moving_average"] = moving_avg
    
    # 簡易予測（線形回帰もどき）
    if len(values) >= 2:
        trend = (values[-1] - values[0]) / len(values)
        next_predicted = values[-1] + trend
        stats["next_predicted"] = next_predicted
    
    # カテゴリー別集計
    categories = {}
    for item in cleaned_data:
        cat = item.get("category", "unknown")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(item["value"])
    
    stats["by_category"] = {
        cat: {"count": len(vals), "average": sum(vals)/len(vals)}
        for cat, vals in categories.items()
    }
    
    return stats

# 複雑な例3: 非同期処理と複数の外部関数呼び出し
async def sync_user_data(user_id: str) -> Dict:
    """
    ユーザーデータを同期する
    """
    # 実際は同期だけでなく、検証、変換、通知も行っている
    
    # ユーザー情報の取得（シミュレーション）
    await asyncio.sleep(0.1)
    user_data = {
        "id": user_id,
        "email": f"user{user_id}@example.com",
        "phone": "123-456-7890"
    }
    
    # データ検証と正規化
    if not validate_email(user_data["email"]):
        user_data["email_valid"] = False
    else:
        user_data["email_valid"] = True
    
    user_data["phone_normalized"] = normalize_phone(user_data["phone"])
    
    # 外部サービスとの同期（シミュレーション）
    sync_results = []
    services = ["crm", "billing", "analytics"]
    
    for service in services:
        await asyncio.sleep(0.05)
        result = {
            "service": service,
            "status": "success" if user_data["email_valid"] else "partial",
            "synced_at": datetime.now().isoformat()
        }
        sync_results.append(result)
    
    # 通知送信（副作用）
    if all(r["status"] == "success" for r in sync_results):
        print(f"All services synced successfully for user {user_id}")
    else:
        print(f"Some services failed to sync for user {user_id}")
    
    return {
        "user": user_data,
        "sync_results": sync_results,
        "fully_synced": all(r["status"] == "success" for r in sync_results)
    }

# 複雑な例4: ジェネレータと状態管理
def generate_report_sections(data: Dict) -> List[str]:
    """
    レポートのセクションを生成する
    """
    # 実際は生成だけでなく、フォーマット、検証、キャッシュも行っている
    
    sections = []
    cache = {}
    
    # ヘッダーセクション
    def format_header(title: str) -> str:
        if title in cache:
            return cache[title]
        formatted = f"=== {title.upper()} ===\n"
        cache[title] = formatted
        return formatted
    
    # サマリーセクション
    if "summary" in data:
        sections.append(format_header("Executive Summary"))
        sections.append(data["summary"] + "\n")
    
    # 統計セクション
    if "stats" in data:
        sections.append(format_header("Statistics"))
        for key, value in data["stats"].items():
            sections.append(f"- {key}: {value}\n")
    
    # 詳細セクション（条件付き生成）
    if data.get("include_details", False):
        sections.append(format_header("Detailed Analysis"))
        
        # ネストされたデータの処理
        if "items" in data:
            for i, item in enumerate(data["items"]):
                subsection = f"\n{i+1}. {item.get('name', 'Unknown')}\n"
                subsection += f"   Value: {item.get('value', 'N/A')}\n"
                subsection += f"   Status: {item.get('status', 'pending')}\n"
                sections.append(subsection)
    
    # フッター（自動生成）
    sections.append(f"\nGenerated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    return sections

# 複雑な例5: クラスメソッドでの複雑な処理
class DataProcessor:
    def __init__(self):
        self.cache = {}
        self.processed_count = 0
    
    def transform_records(self, records: List[Dict]) -> List[Dict]:
        """
        レコードを変換する
        """
        # 実際は変換だけでなく、フィルタリング、集約、キャッシュも行う
        
        transformed = []
        groups = {}
        
        for record in records:
            # フィルタリング
            if not record.get("active", True):
                continue
            
            # 変換
            transformed_record = {
                "id": record.get("id", f"generated_{self.processed_count}"),
                "name": record.get("name", "").strip().title(),
                "value": float(record.get("value", 0)),
                "processed_at": datetime.now().isoformat()
            }
            
            # グループ化のための処理
            group_key = record.get("group", "default")
            if group_key not in groups:
                groups[group_key] = []
            groups[group_key].append(transformed_record)
            
            # キャッシュ更新
            self.cache[transformed_record["id"]] = transformed_record
            self.processed_count += 1
            
            transformed.append(transformed_record)
        
        # 集約情報の追加（副作用）
        for record in transformed:
            group_key = next((k for k, v in groups.items() if record in v), "default")
            record["group_size"] = len(groups[group_key])
            record["group_average"] = sum(r["value"] for r in groups[group_key]) / len(groups[group_key])
        
        return transformed

# 複雑な例6: 誤解を招きやすい関数名
def validate_configuration(config: Dict) -> bool:
    """
    設定を検証する
    """
    # 実際は検証だけでなく、デフォルト値の設定、正規化、ログ出力も行う
    
    # 必須フィールドの検証
    required_fields = ["api_key", "endpoint", "timeout"]
    for field in required_fields:
        if field not in config:
            # デフォルト値を設定（副作用）
            if field == "timeout":
                config[field] = 30
            elif field == "endpoint":
                config[field] = "https://api.example.com"
            else:
                return False
    
    # 値の正規化（副作用）
    if isinstance(config.get("timeout"), str):
        config["timeout"] = int(config["timeout"])
    
    if not config["endpoint"].startswith("http"):
        config["endpoint"] = "https://" + config["endpoint"]
    
    # 追加の設定項目を生成（副作用）
    config["max_retries"] = config.get("max_retries", 3)
    config["retry_delay"] = config.get("retry_delay", 1.0)
    config["validated_at"] = datetime.now().isoformat()
    
    # ログ出力（副作用）
    print(f"Configuration validated: {list(config.keys())}")
    
    return True