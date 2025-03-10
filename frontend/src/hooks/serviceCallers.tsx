import { ChatMessage } from '../interfaces/iprompt';
//import config from "../config.json";

let streamReader: ReadableStreamDefaultReader<Uint8Array> | null = null;

const backendAPIHost = "http://localhost:8765";
//const backendAPIHost = ""; // config.backendAPIHost;

export const cancelStream = (onDataReceived: (data: string) => void) => {
  if (streamReader) {  // Ensure streamReader is assigned before calling cancel()
      streamReader.cancel().then(() => {
          onDataReceived("");
          streamReader = null; // Reset streamReader after cancellation
      }).catch(error => {
          console.error("Error cancelling the stream:", error);
      });
  }
}

export const getDocList = (onDataReceived:any) => {
  const postPayLoad = {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
  };

  fetch(`${backendAPIHost}/chat/doclist`, postPayLoad)
  .then(response => {
    return response.text();
  })
  .then(data => {
    onDataReceived(data);
  })
  .then(text => {
    //console.log(text); // Here you can process your text data
    // If the server sends JSON strings, you can parse them here
    // const data = JSON.parse(text);
    // Process the data...
  })
  .catch(error => {
    console.error("getDocList:", error);
    onDataReceived("Error occurred while sending message.");
    return {
      "api": "getDocList",
      "method": "GET",
      "status": "error",
      "chatHistory": null,
      "message": error.toString() + "\n\n Please check if bot api is running."
    };
  });
}

export const getGreetings = (onDataReceived:any) => {
    const postPayLoad = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    };

    fetch(`${backendAPIHost}/chat/greeting`, postPayLoad)
    .then(response => {
      return response.text();
    })
    .then(data => {
      onDataReceived(data);
    })
    .then(text => {
      //console.log(text); // Here you can process your text data
      // If the server sends JSON strings, you can parse them here
      // const data = JSON.parse(text);
      // Process the data...
    })
    .catch(error => {
      console.error("getGreetings:", error);
      onDataReceived("Error occurred while sending message.");
      return {
        "api": "getGreetings",
        "method": "GET",
        "status": "error",
        "chatHistory": null,
        "message": error.toString() + "\n\n Please check if bot api is running."
      };
    });
}

export const sendMessage = (userQuery: string, chatMessage: ChatMessage, onDataReceived:any, queryCategory?: string, imageUrl?: string, conversationId?: string) => {

    if (userQuery === '') {
        return;
    }

    const apiRequest = {"userMessage": userQuery, 
                        "queue_name": chatMessage?.queue_name, 
                        "query_category": queryCategory,
                        "image_url": imageUrl,
                        "conversation_id": conversationId,
                        "use_streaming": chatMessage?.use_streaming}

    const postPayLoad = {
        method: "POST",
        //headers: { 'Content-Type': 'application/json', 'Authorization': bearer },
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiRequest)
    };


    fetch(`${backendAPIHost}/chat/conversation`, postPayLoad)
    .then(response => {
      return response.text();
      
    })
    .then(data => {
      onDataReceived(data);
    })
    .then(text => {
      //console.log(text); // Here you can process your text data
      // If the server sends JSON strings, you can parse them here
      // const data = JSON.parse(text);
      // Process the data...
    })
    .catch(error => {
      console.error("sendMessage:", error);
      onDataReceived("Error occurred while sending message.");
      return {
        "api": "send_chat",
        "method": "POST",
        "status": "error",
        "chatHistory": null,
        "message": error.toString() + "\n\n Please check if bot api is running."
      };
    });
}

