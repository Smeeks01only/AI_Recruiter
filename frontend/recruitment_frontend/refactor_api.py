import os
import re

SRC_DIR = r"c:\Users\Charlton Dzikiti\Desktop\AI Recruit\frontend\recruitment_frontend\src"

def get_relative_import_path(filepath):
    # calculate depth
    rel_path = os.path.relpath(filepath, SRC_DIR)
    depth = rel_path.count(os.sep)
    if depth == 0:
        return "./config"
    return "../" * depth + "config"

for root, _, files in os.walk(SRC_DIR):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if "http://127.0.0.1:8000" in content:
                # Add import if needed
                if "import API_BASE_URL from" not in content:
                    import_statement = f'import API_BASE_URL from "{get_relative_import_path(filepath)}";\n'
                    # insert after first line or imports
                    parts = content.split('\n')
                    insert_idx = 0
                    for i, line in enumerate(parts):
                        if line.startswith("import "):
                            insert_idx = i + 1
                    parts.insert(insert_idx, import_statement.strip())
                    content = '\n'.join(parts)

                # Replace "http://127.0.0.1:8000..." with `${API_BASE_URL}...`
                # Pattern 1: "http://127.0.0.1:8000/api..."
                content = re.sub(r'"http://127\.0\.0\.1:8000(/.*?)"', r'`${API_BASE_URL}\1`', content)
                # Pattern 2: `http://127.0.0.1:8000/api...${...}`
                content = re.sub(r'http://127\.0\.0\.1:8000', r'${API_BASE_URL}', content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
