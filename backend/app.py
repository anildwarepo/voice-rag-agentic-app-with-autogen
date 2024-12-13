import os

from dotenv import load_dotenv
from aiohttp import web
from ragtools import attach_rag_tools
from rtmt import RTMiddleTier
from azure.identity import DefaultAzureCredential
from azure.core.credentials import AzureKeyCredential
import json
import agnext_bot

def greeting():
    return """Hello, I am a multi-agent chatbot. 
            I can answer questions about companies, perform data analysis, 
            create plots for visualization and answer questions about product usage and know-how.
            """

def getDocList():
    # read file names from folder
    docDirectory = "document_classification/demodocs"
    docList = []

    #for filename in os.listdir(docDirectory): with index
    for index, filename in enumerate(os.listdir(docDirectory)):
        #doc_name = filename.split(".")
        doc = {"key": f'd10{index}', "text": filename, "category": "Document Analysis"}
        docList.append(doc)
    return json.dumps(docList)

async def handle_conversation(request):
    # Read the JSON body from the request
    try:
        data = await request.json()  # Assuming the request contains JSON data

        print("Data received: ", data)
    except json.JSONDecodeError:
        return web.Response(text="Invalid JSON payload", status=400)
    
    try:
        image_url = data['image_url']
    except KeyError:
        image_url = None

    try:
        response = await agnext_bot.start_multiagent_chat(data['userMessage'], image_url)
        return web.Response(text=response)
    except Exception as e:
        print(e)
        return web.Response(text="An error occurred while processing the request", status=500)

if __name__ == "__main__":
    load_dotenv()
    llm_endpoint = os.environ.get("AZURE_OPENAI_REALTIME_ENDPOINT")
    llm_deployment = os.environ.get("AZURE_OPENAI_REALTIME_DEPLOYMENT")
    llm_key = os.environ.get("AZURE_OPENAI_REALTIME_API_KEY")
    search_endpoint = os.environ.get("AZURE_SEARCH_ENDPOINT")
    search_index = os.environ.get("AZURE_SEARCH_INDEX")
    search_key = os.environ.get("AZURE_SEARCH_API_KEY")

    credentials = DefaultAzureCredential() if not llm_key or not search_key else None

    app = web.Application()

    rtmt = RTMiddleTier(llm_endpoint, llm_deployment, AzureKeyCredential(llm_key) if llm_key else credentials)
    rtmt.system_message = """
    You are on online payments company Transify's customer support assistant. You can speak only english language.
    You can answer questions from user's credit card balance, transaction details.
    You need to listen to the user question and respond to user question by calling the 'multiagent' tool. 
    Read the response as is from the 'multiagent' tool.
    Always use the 'multiagent' tool to provide your response.
    """
    attach_rag_tools(rtmt, search_endpoint, search_index, AzureKeyCredential(search_key) if search_key else credentials)

    rtmt.attach_to_app(app, "/realtime")
    app.add_routes([web.get('/', lambda _: web.FileResponse('./static/static/index.html'))])
    app.router.add_static('/static/', path='./static', name='static')

    app.add_routes([web.get('/chat/greeting', lambda _: web.Response(text=greeting()))])
    app.add_routes([web.get('/chat/doclist', lambda _: web.Response(text=getDocList()))])
    app.add_routes([web.post('/chat/conversation', handle_conversation)])

    
    web.run_app(app, host='localhost', port=8765)
