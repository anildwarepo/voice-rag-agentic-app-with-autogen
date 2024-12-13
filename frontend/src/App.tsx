import { useState } from "react";

import FAQComponent from "./components/scenarios/faq";
import * as Styles from "./components/scenarios/styles";
import ChatInputComponent from "./components/scenarios/ChatInput";
import AIVoiceComponent from "./components/scenarios/AIVoiceComponent";
import { mergeStyles, DefaultPalette} from '@fluentui/react/lib/Styling';
import logo from "./assets/logo.svg";

function App() {
    
    const [faq, setFAQ] = useState('');
    const [queryCategory, setQueryCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [handleMessageRef, setHandleMessageRef] = useState<((data: any) => void) | undefined>(undefined);


    // Callback function to update userQuery
    const updateUserQuery = (query: string, queryCategory: string, imageUrl?: string) => {
        setFAQ(query);
        setQueryCategory(queryCategory);
        setImageUrl(imageUrl? imageUrl: '');
    };
    return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <div style={{ width: '20%', height: '100%', backgroundColor: DefaultPalette.neutralDark}}>
            <div className={mergeStyles(Styles.leftParentContainerStyles)}>
                <div className={mergeStyles(Styles.leftContainerStyles)}>
                    <FAQComponent onPanelClick={updateUserQuery}/>
                </div>
            </div>
            
        </div>
        <div style={{ width: '40%', height: '100%', backgroundColor: '#424242' }}>
            <div className={mergeStyles(Styles.rightParentContainerStyles)}>
                <div className={mergeStyles(Styles.rightContainerStyles)}>
                    <ChatInputComponent faq={faq} queryCategory={queryCategory} 
                    imageUrl={imageUrl}
                    refHandleMessage={(fn) => setHandleMessageRef(() => fn)} // Pass the reference setter

                    />
                </div>
            </div>
        </div>

        <div style={{ width: '40%', height: '100%', backgroundColor: '#424242' }}>
            <div className={mergeStyles(Styles.leftParentContainerStyles)}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} className={mergeStyles(Styles.leftContainerStyles)}>
                    <AIVoiceComponent handleMessage={handleMessageRef}/>
                </div>
            </div>
        </div>
    </div>

    );
}

export default App;
