import React, {useState, useEffect, useRef, useCallback} from "react"
import { Box, Button, Flex, MessageVariants, Spinner} from '@twilio-paste/core';
import {CustomizationProvider} from '@twilio-paste/core/customization';
import {useLocation} from 'react-router-dom';
import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
} from '@twilio-paste/core/chat-log';
import { SMSCapableIcon } from "@twilio-paste/icons/esm/SMSCapableIcon";
import {Avatar} from '@twilio-paste/core/avatar';
import {Combobox} from '@twilio-paste/core/combobox';
import {Input} from '@twilio-paste/core/input';
import {Label} from '@twilio-paste/core/label';
import useMultipleAPIRequest from "./hooks/useMessagingLogsAPI";
import {RadioButtonGroup, RadioButton} from '@twilio-paste/core/radio-button-group';
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";

export default function MessagingLogs() {

    const [pageURI1, setPageURI1] = useState<string>('')
    const [pageURI2, setPageURI2] = useState<string>('')
    const [inputItems, setSelectedItem] = React.useState('');
    const [numbers, setNumbers] = useState<string[]>([]);
    const [userNumber, setUserNumber] = React.useState('');
    const [product, setProduct] = React.useState('sms');
    const location = useLocation();

    useEffect(() => {
        const fetchTwilioNumbers = async () => {
            const data = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${location.state.accountSID}/IncomingPhoneNumbers.json`, {
              headers: new Headers({
                "Authorization": `Basic ${btoa(`${location.state.accountSID}:${location.state.authToken}`)}`
              })
            });
            const jsonData = await data.json();
            
            var newData: Array<string> = []
            jsonData.incoming_phone_numbers.forEach((element: { phone_number: any; }) => {
                newData.push(element.phone_number)
            });
            //Add WhatsApp Sandbox number
            newData.push("+14155238886")
            setNumbers(newData)        
          };
          fetchTwilioNumbers();
    }, [location.state.accountSID,location.state.authToken]);

    const {
        messageLogs,
        loading,
        error,
        hasMore,
        URI1,
        URI2
    } = useMultipleAPIRequest(pageURI1, pageURI2, inputItems, userNumber, product, location.state.accountSID, location.state.authToken)

    const observer = useRef<IntersectionObserver | null>(null);
    
    const lastLogRef = useCallback(node => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
        setPageURI1(URI1)
        setPageURI2(URI2)
        }
      })
      if (node) observer.current.observe(node)
    }, [loading, hasMore, URI1, URI2])

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        var add = "";
        if(product === 'whatsapp'){
            add = 'whatsapp%3A';
        }
        setPageURI1(`/2010-04-01/Accounts/${location.state.accountSID}/Messages.json?From=${add + inputItems}&To=${add + userNumber}`)
        setPageURI2(`/2010-04-01/Accounts/${location.state.accountSID}/Messages.json?From=${add + userNumber}&To=${add + inputItems}`)
    }

    return(
        <CustomizationProvider baseTheme="default">

<Flex>
    <Flex>
    <Avatar size="sizeIcon110" name="avatar" src={require("./assets/twilio-icon.png")} />
    </Flex>
    <Flex grow>
      <Box padding="space20" width="100%">
       <h2><b>Pretty Logs</b></h2>
      </Box>
    </Flex>
  </Flex>
            <Box width={1000} margin="space100" padding="space10" >

            <Box margin="space100" width={300} >
            <form onSubmit={handleOnSubmit}>

            <RadioButtonGroup onChange={selected => {
                setProduct(selected)
                }} attached name="foo" legend="Choose a channel">
      <RadioButton value="sms" defaultChecked><SMSCapableIcon color={"colorTextBrandHighlight"} decorative={true} title="sms icon" />SMS</RadioButton>
      <RadioButton value="whatsapp"><ChatIcon  color={"colorTextSuccess"} decorative={true} title="whatsapp icon"/>WhatsApp</RadioButton>
    </RadioButtonGroup><br/>
    
                    <Combobox
                        autocomplete
                        items={numbers}
                        labelText="Choose Twilio number"
                        onSelectedItemChange={changes => {
                                setSelectedItem(encodeURIComponent(changes.selectedItem));
                        }}
                        required
                    />

                    <br/>

                    <Label htmlFor="userNumber" required>
                        Enter User number
                    </Label>
                    <Input aria-describedby="userNumber" id="userNumber" name="userNumber" onChange={event => {
                            setUserNumber(encodeURIComponent(event.target.value))
                        }} type="text" placeholder="+1xxxxxxxxx" required />

                    <br/>

                    <Button type='submit' variant='primary'>Submit</Button>
            </form>
            </Box>


            <Box width={1000} margin="space100" padding="space10" borderRadius="borderRadius30" >
            
            
                <ChatLog>
                
                    
                        {messageLogs.map((value, index) => {
                            var direction: MessageVariants = value.direction.includes('outbound') ? 'outbound' : 'inbound';

                            if(messageLogs.length === index + 1)
                                return (
                                    <ChatMessage ref={lastLogRef} key={value.sid} variant={direction}>
                                        <ChatBubble>
                                        {value.body}
                                        </ChatBubble>

                                        <ChatMessageMeta aria-label="said by you at 11:27 AM">
                                            <ChatMessageMetaItem>{new Date(value.date_sent).toUTCString()}</ChatMessageMetaItem>
                                        </ChatMessageMeta>

                                        <ChatMessageMeta aria-label={new Date(value.date_sent).toUTCString()}>


<ChatMessageMetaItem>
    {value.error_code?<Avatar size="sizeIcon20" name={value.sid} src={require("./assets/error.jpg")}/>: <>{value.status}</>}
   <a href={`https://www.twilio.com/docs/api/errors/${value.error_code}`} target="_blank" rel="noreferrer">{value.error_code}</a>
</ChatMessageMetaItem>

</ChatMessageMeta>

                                    </ChatMessage>

                                    
                                    )
                            else
                                return (
                                    <ChatMessage key={value.sid} variant={direction}>
                                        <ChatBubble>
                                        {value.body}
                                        </ChatBubble>

                                        <ChatMessageMeta aria-label="said by you at 11:27 AM">
                                            <ChatMessageMetaItem>{new Date(value.date_sent).toUTCString()}</ChatMessageMetaItem>
                                        </ChatMessageMeta>
                                        
                                        <ChatMessageMeta aria-label={new Date(value.date_sent).toUTCString()}>


<ChatMessageMetaItem>
    {value.error_code?<Avatar size="sizeIcon20" name={value.sid} src={require("./assets/error.jpg")}/>: <>{value.status}</>}
    <a href={`https://www.twilio.com/docs/api/errors/${value.error_code}`} target="_blank" rel="noreferrer">{value.error_code}</a>
</ChatMessageMetaItem>

</ChatMessageMeta>
                                    </ChatMessage>)
                        })}
                </ChatLog>
                </Box>
            </Box>
                
        {loading&&<><Flex>
                <Box paddingLeft="space200" object-position= "center">
                    <Spinner size="sizeIcon70" color="colorTextSuccess" decorative={false} title="Loading" />
                </Box>
            </Flex></>}
        <div>{error && 'Error...'}</div>
        </CustomizationProvider>
    )
}