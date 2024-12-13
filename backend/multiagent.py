from multi_agent.multi_agent_implementation import *


runtime = SingleThreadedAgentRuntime()
asyncio.run(register_agents(runtime))



async def get_answer(conversation_id, user_query):
    
    await runtime.publish_message(GroupChatMessage(body=UserMessage(content=user_query, source="user"), 
                                                conversation_id=conversation_id), DefaultTopicId(type="group_chat_any_topic", source=conversation_id)) 

    group_chat_result = ""
    try:
        # Wait for a message in the queue, or you can use a timeout if needed
        #group_chat_result = (await queue.get()).body.content
        # clear queue 
        async with condition:
            while conversation_id not in llm_results_dict:
                await condition.wait()

            
            group_chat_result = llm_results_dict[conversation_id].body.content
            del llm_results_dict[conversation_id]
            print(f"conversation_id: {conversation_id}")
            print("\033[35m" + "-" * 20 + "\033[0m")
    except Exception as e:
        # Handle any exception that may occur during the wait for the response
        print(f"Error retrieving message from queue: {e}")
        group_chat_result = "An error occurred while waiting for the response."

    print(group_chat_result)
    return group_chat_result

conversation_id1 = str(uuid.uuid4())
async def start_multiagent_chat(user_message: str, image_url: str = None) -> str:
    #user_query = "I want to know my credit card balance."
    
    try:
        runtime.start()
    except Exception as e:
        print(f"runtime already started: {e}")
        

    result = await get_answer(conversation_id1, user_message)
    return result