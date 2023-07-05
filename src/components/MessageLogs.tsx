import { ChatBubble, ChatMessage, MessageVariants } from "@twilio-paste/core";

type resultProps = {
    body: string,
    num_segments: string,
    direction: MessageVariants,
    from: string,
    date_updated: string,
    price: string,
    error_message: string,
    uri: string,
    account_sid: string,
    num_media: string,
    to: string,
    date_created: string,
    status: string,
    sid: string,
    date_sent: string,
    messaging_service_sid: string,
    error_code: string,
    price_unit: string,
    api_version: string,
    subresource_uris: {
        media: string,
        feedback: string
    }
  };
  
export default function MessageLogs(message: resultProps, lastLogRef: any){

    var direction: MessageVariants = message.direction.includes('outbound') ? 'outbound' : 'inbound';

    return (
        <ChatMessage ref={lastLogRef} key={message.sid} variant={direction}>
            <ChatBubble>
            {message.body}
            </ChatBubble>
        </ChatMessage>
    )
}