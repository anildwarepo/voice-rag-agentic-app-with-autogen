import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

import { Button } from "../../components/ui/button";
import { GroundingFiles } from "../../components/ui/grounding-files";
import GroundingFileView from "../../components/ui/grounding-file-view";
import StatusMessage from "../../components/ui/status-message";

import useRealTime from "../../hooks/useRealtime";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import useAudioPlayer from "../../hooks/useAudioPlayer";

import { GroundingFile, ToolResult } from "../../types";

interface AIVoiceComponentProps {
    handleMessage?: (data: any) => void; // Add the prop
}

const AIVoiceComponent: React.FC<AIVoiceComponentProps> = ({ handleMessage }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [groundingFiles, setGroundingFiles] = useState<GroundingFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<GroundingFile | null>(null);

    const { startSession, addUserAudio, inputAudioBufferClear } = useRealTime({
        onWebSocketOpen: () => console.log("WebSocket connection opened"),
        onWebSocketClose: () => console.log("WebSocket connection closed"),
        onWebSocketError: event => console.error("WebSocket error:", event),
        onReceivedError: message => console.error("error", message),
        onReceivedResponseAudioDelta: message => {
            isRecording && playAudio(message.delta);
        },
        onReceivedInputAudioBufferSpeechStarted: () => {
            stopAudioPlayer();
        },
        onReceivedExtensionMiddleTierToolResponse: message => {
            const result: ToolResult = JSON.parse(message.tool_result);

            const files: GroundingFile[] = result.sources.map(x => {
                const match = x.chunk_id.match(/_pages_(\d+)$/);
                const name = match ? `${x.title}#page=${match[1]}` : x.title;
                return { id: x.chunk_id, name: name, content: x.chunk };
            });

            setGroundingFiles(prev => [...prev, ...files]);
        },
        onReceivedResponseDone: responseDone => {
            console.log("Response processing done:");
            if (responseDone.response && responseDone.response.output) {
                responseDone.response.output.forEach(output => {
                    if (output.content) {
                        output.content.forEach(content => {
                            if (content.transcript) {
                                console.log("Transcript:", content.transcript);
                                if (handleMessage) {
                                    handleMessage(content.transcript); // Call handleMessage here
                                }
                            }
                        });
                    }
                });
            } else {
                console.log("Transcript not found in the response.");
            }
        }
    });

    const { reset: resetAudioPlayer, play: playAudio, stop: stopAudioPlayer } = useAudioPlayer();
    const { start: startAudioRecording, stop: stopAudioRecording } = useAudioRecorder({ onAudioRecorded: addUserAudio });

    const onToggleListening = async () => {
        if (!isRecording) {
            startSession();
            await startAudioRecording();
            resetAudioPlayer();

            setIsRecording(true);
        } else {
            await stopAudioRecording();
            stopAudioPlayer();
            inputAudioBufferClear();

            setIsRecording(false);
        }
    };

    return (

        <div>
       
        <h3 style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text  text-4xl 
        font-bold text-transparent md:text-2xl">
            Talk to your Transify Agent
        </h3>
         
        <div className="mb-4 flex flex-col items-center justify-center">
            <Button
                onClick={onToggleListening}
                className={`h-12 w-60 ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-purple-500 hover:bg-purple-600"}`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
                {isRecording ? (
                    <>
                        <MicOff className="mr-2 h-4 w-4" />
                        Stop conversation
                    </>
                ) : (
                    <>
                        <Mic className="mr-2 h-6 w-6" />
                    </>
                )}
            </Button>
            <StatusMessage isRecording={isRecording} />
        </div>
        <GroundingFiles files={groundingFiles} onSelected={setSelectedFile} />
    </div>
    );
};

export default AIVoiceComponent;