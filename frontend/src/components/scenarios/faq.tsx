import * as React from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Divider,
    Label,
} from "@fluentui/react-components";
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import { Text } from "@fluentui/react";
import * as Styles from "./styles";
import { useEffect } from 'react';
import { getDocList } from '../../hooks/serviceCallers';

interface FAQComponentProps {
    onPanelClick: (query: string, queryCategory: string, imageUrl?: string) => void;
}

interface Doc {
    key: string;
    text: string;
    image_url?: string;
    category: string;
}

const FAQComponent: React.FC<FAQComponentProps> = ({ onPanelClick, ...props }) => {

    
    
 

    const options = [
        { key: 'q11', text: 'What are the different product divisions in Microsoft?', 'category': 'Company Info' },
        { key: 'q12', text: 'What industries does Autodesk operate in?', 'category': 'Company Info' },
        { key: 'q13', text: 'what was revenue for autodesk in the last quarter?', 'category': 'Company Info' },
        { key: 'q14', text: 'what are autodesk plans to grow revenue using AI?', 'category': 'Company Info' },
        { key: 'q15', text: 'Show me the YTD gain of 10 largest technology companies as of today.', 'category': 'Data Analysis' },  
        { key: 'q1', text: 'how to train NLP model using aml sdk v2. explain in 10 steps.', 'category': 'Product Guide' },
        { key: 'q2', text: 'Show me daily revenue trends per region', 'category': 'Data Analysis' },
        { key: 'q3', text: 'Is that true that top 20% customers generate 80% revenue? What is their percentage of revenue contribution?', 'category': 'Data Analysis' },
        { key: 'q4', text: 'Which products have most seasonality in sales quantity?', 'category': 'Data Analysis' },
        { key: 'q5', text: 'Which customers are most likely to churn who use our products?', 'category': 'Data Analysis' },
        { key: 'q6', text: 'What is the impact of discount on sales? What is optimal discount rate?', 'category': 'Data Analysis' },
        { key: 'q7', text: 'Predict monthly revenue for next 6 months.', 'category': 'Data Analysis' },
        { key: 'q8', text: 'Pick top 20 customers generated most revenue and for each customer show 3 products that they purchased most', 'category': 'Data Analysis'},
        { key: 'q9', text: 'which type of telco customer has the highest churn rate?. Generate customer email to address churn rate.' , 'category': 'Data Analysis'},
        { key: 'q16', text: 'Show me daily revenue trends per region' , 'category': 'Small Language Model'},  
        { key: 'q17', text: 'What is the impact of discount on sales? What is optimal discount rate?' , 'category': 'Small Language Model'},
        { key: 'q18', text: 'Is that true that top 20% customers generate 80% revenue? What is their percentage of revenue contribution?' , 'category': 'Small Language Model'},           
        { key: 'q19', text: 'How many customers are there in total?', 'category': 'Data Analysis'},
        { key: 'q20', text: 'What are the first and last names of all customers?', 'category': 'Data Analysis'},
        { key: 'q22', text: 'What is the distribution of customers by birth year?', 'category': 'Data Analysis'},
        { key: 'q23', text: 'How many customers were born in each month?', 'category': 'Data Analysis'},
        { key: 'q24', text: 'Which countries are our customers from?', 'category': 'Data Analysis'},
        { key: 'q25', text: 'How many customers are from a specific country?', 'category': 'Data Analysis'},
        { key: 'q26', text: 'What is the stock price of NVDA on 2024/06/01?', 'category': 'MultiDomain'},
        { key: 'q27', text: 'how to use gpu in machine learning?', 'category': 'MultiDomain'},
        { key: 'q28', text: 'is python support in azure functions?', 'category': 'MultiDomain'},
        { key: 'q29', text: 'does databricks support r?', 'category': 'MultiDomain'},
        { key: 'q30', text: 'tell me about einstien.', 'category': 'MultiDomain'},
        { key: 'q31', text: 'what are the limitations of Publishing Drawings to 3D DWF?', 'category': 'MultiDomain'},
        { key: 'q32', text: 'how to change the Railing Extensions at Floor Levels?', 'category': 'MultiDomain'},
        { key: 'q33', text: 'how many windows does this construction have?', 'image_url':'https://www.constructiontuts.com/wp-content/uploads/2018/10/Construction-Drawings2.jpg', 'category': 'Image Analysis'},
        { key: 'q34', text: 'are there any safety harzards here?', 'image_url':'https://cimon-rt.s3.amazonaws.com/profile_cimon/1670865495221-BAS%26HVAC.jpg', 'category': 'Image Analysis'},
        


        /*
        { key:'q22', text:'Anti-Discrimination Policy', 'category': 'Document Analysis' },
        { key:'q23', text:'At-Will Employment Policy', 'category': 'Document Analysis' },
        { key:'q24', text:'Attendance Policy', 'category': 'Document Analysis' },
        { key:'q25', text:'Bereavement Policy', 'category': 'Document Analysis' },
        { key:'q26', text:'BYOD Policy', 'category': 'Document Analysis' },
        { key:'q27', text:'Cell Phone Policy', 'category': 'Document Analysis' },
        { key:'q28', text:'Company Credit Card Policy', 'category': 'Document Analysis' },
        { key:'q29', text:'Company Cyber Security Policy', 'category': 'Document Analysis' },
        { key:'q30', text:'Company Data Protection Policy', 'category': 'Document Analysis' },
        { key:'q31', text:'Company Email Usage Policy', 'category': 'Document Analysis' },
        { key:'q32', text:'Disciplinary Policy', 'category': 'Document Analysis' },
        { key:'q33', text:'DRESS CODE POLICY', 'category': 'Document Analysis' },
        { key:'q34', text:'Employee Code of Conduct Policy', 'category': 'Document Analysis' },
        { key:'q35', text:'Employee Confidentiality Policy', 'category': 'Document Analysis' },
        { key:'q36', text:'Employee Conflict of Interest Policy', 'category': 'Document Analysis' },
        { key:'q37', text:'Employee Disability Policy', 'category': 'Document Analysis' },
        { key:'q38', text:'Employee Exit Interview Policy', 'category': 'Document Analysis' },
        { key:'q39', text:'Employee Exit Policy', 'category': 'Document Analysis' },
        { key:'q40', text:'Employee Paid Time Off Policy', 'category': 'Document Analysis' },
        { key:'q41', text:'Employee Parking Policy', 'category': 'Document Analysis' },
        { key:'q42', text:'Employee Performance Review Policy', 'category': 'Document Analysis' },
        { key:'q43', text:'Employee Promotion Policy', 'category': 'Document Analysis' },
        { key:'q44', text:'Employee Recruitment Policy', 'category': 'Document Analysis' },
        { key:'q45', text:'Employee Referral Policy', 'category': 'Document Analysis' },
        { key:'q46', text:'Employee Reward and Recognition Policy', 'category': 'Document Analysis' },
        { key:'q47', text:'Employee Termination Policy', 'category': 'Document Analysis' },
        { key:'q48', text:'Employee Training and Development Policy', 'category': 'Document Analysis' },
        { key:'q49', text:'Employee Transport Services', 'category': 'Document Analysis' },
        { key:'q50', text:'Exit Interview Policy', 'category': 'Document Analysis' },
        { key:'q51', text:'Flexible Working Hours Policy', 'category': 'Document Analysis' },
        { key:'q52', text:'Gratuity Policy', 'category': 'Document Analysis' },
        { key:'q53', text:'Grievance Policy', 'category': 'Document Analysis' },
        { key:'q54', text:'Incentive Policy', 'category': 'Document Analysis' },
        { key:'q55', text:'Increment Policy', 'category': 'Document Analysis' },
        { key:'q56', text:'Joining Policy', 'category': 'Document Analysis' },
        { key:'q57', text:'Leave Encashment Policy Format', 'category': 'Document Analysis' },
        { key:'q58', text:'Leave Policy', 'category': 'Document Analysis' },
        { key:'q59', text:'Maternity Leave Policy', 'category': 'Document Analysis' },
        */
    ];

    const [docList, setDocList] = React.useState<Record<string, typeof options>>({});
    
    useEffect(() => {
        const groupedDocs: Record<string, Doc[]> = {};
        options.forEach((option) => {
            if (!groupedDocs[option.category]) {
                groupedDocs[option.category] = [];
            }
            groupedDocs[option.category].push(option);
        });
        setDocList(groupedDocs);
    }, []); 

  

    const handlePanelClick = (e: any, queryCategory: string, imageUrl?: string) => {
        onPanelClick(e, queryCategory, imageUrl);
        //onPanelClick(e.target.textContent || e.target.innerText); // Update this string as needed
    };

    
    return (

       <div>
            <Label size='large' weight="semibold" >
                <span style={{color: '#d13438'}}>FAQs</span>
            </Label>

            <Accordion multiple>
            {Object.entries(docList).map(([category, questions], idx) => (
               
             
                <AccordionItem key={idx} value={category}>
                <AccordionHeader>
                        <Text className={Styles.faqStyle} variant="mediumPlus">{category}</Text>
                    </AccordionHeader>
                        {questions.map((question) => (
                            <AccordionPanel key={question.key}>
                                <div className={Styles.faqItemsStyle} onClick={() => handlePanelClick(question.text, question.category, question.image_url)}>
                                    {question.text}
                                </div>
                            </AccordionPanel>
                        ))}
                        
                </AccordionItem>
                
            ))}

            </Accordion>        
           
        </div>
    )
}

export default FAQComponent;