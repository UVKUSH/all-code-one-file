# 📝 All Code One File – VS Code Extension for Merging & AI Processing  

🔹 **All Code One File** is a powerful **VS Code extension** that **merges all code files** from selected folders into **a single file** or **splits them based on token limits**.  
🔹 Ideal for **LLMs (ChatGPT, Claude, OpenAI, Mistral, etc.)**, helping with **AI-friendly code processing**.  
🔹 Supports **multiple folders, file extensions, and AI-compatible batch file merging**.  

---

## 🚀 **Key Features** (SEO Optimized)  
✅ **Merge all code files into one** for easier processing with **ChatGPT & AI** tools.  
✅ **Automatically split large files** for **AI token limits** (ChatGPT, Claude, etc.).  
✅ **Batch merge multiple folders & extensions** (`.dart`, `.js`, `.ts`, `.py`, etc.).  
✅ **Works in VS Code with a single command** – No extra setup required.  
✅ **Saves merged files inside a `merge/` folder** for easy access.  
✅ **Fast & lightweight – No dependencies needed.**  

---

## 🛠 **How to Use (Step-by-Step)**  
1️⃣ Open **VS Code workspace** with your project.  
2️⃣ Press **`Cmd+Shift+P`** (Mac) or **`Ctrl+Shift+P`** (Windows/Linux).  
3️⃣ Search for **`All Code One File: Merge Files`**.  
4️⃣ **Choose folders** to scan (`lib, src, components` etc.).  
5️⃣ **Select file extensions** to merge (`.dart, .js, .py`, etc.).  
6️⃣ **Set Merge Mode:**  
   - ✅ `"Merge into one file"` → **Creates `merged.txt`**.  
   - ✅ `"Split files by token limits"` → **Creates `merged_1.txt`, `merged_2.txt`**, etc.  
7️⃣ **Enter token limit:**  
   - **Enter `0`** → Creates **one file (`merged.txt`)**.  
   - **Enter `4000`** → Splits at **4000 tokens per file**.  
   - **Enter higher numbers** for larger AI-friendly chunks.  

---

## 🔢 **Understanding Token-Based Splitting (For AI & LLM Processing)**  
LLMs like **ChatGPT, Claude, OpenAI, and Gemini** have **token limits**, which means they can't process files beyond a certain size.  

| **Token Limit** | **Merge Behavior** |
|---------------|----------------------|
| **0**         | ✅ All files combined into **one `merged.txt`**. |
| **4000**      | ✅ Splits into **`merged_1.txt`, `merged_2.txt`**, etc. |
| **8000**      | ✅ Splits into **larger AI-friendly chunks**. |

💡 **TIP:** If you're unsure, just **enter `0`** to keep everything in one file.  

---

## 📂 **Where Are Merged Files Saved?**  
🗂 **All merged files are saved in the `merge/` folder inside your project:**  
✅ **Automatic folder creation – No manual setup needed!**  

---

## 🔥 **Who Should Use This? (Use Cases for AI & Code Processing)**  
✅ **AI Developers:** Merge large code files for easier processing with **ChatGPT, Claude, OpenAI, and Gemini.**  
✅ **Flutter & JavaScript Developers:** Merge **Dart, JavaScript, TypeScript, and Python** files for LLM-powered automation.  
✅ **Data Scientists:** Pre-process scripts before sending them to an AI model.  
✅ **Automators & AI Engineers:** Token-based splitting makes large projects **LLM-friendly**.  

---
