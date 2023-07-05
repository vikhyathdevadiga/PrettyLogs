import { useEffect, useState } from 'react'
import axios, { Canceler } from 'axios'
import { MessageVariants } from '@twilio-paste/core';

export default function useMessagingLogsAPI(pageURI1: string, pageURI2: string, fromNumber: string, toNumber: string, product: string, accountSID: string, authToken: string) {

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
    
    const baseURL = 'https://api.twilio.com';
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [messageLogs, setMessageLogs] = useState<resultProps[]>([]);
    const [hasMore, setHasMore] = useState(false)
    const [URI1, setURI1] = useState('')
    const [URI2, setURI2] = useState('')
    
    useEffect(() => {
        setMessageLogs([])
    }, [fromNumber, toNumber, product])


  useEffect(() => {
    setLoading(true)
    setError(false)

    let cancel: Canceler

    const requestOptions1 = {
        auth: {
            username: accountSID,
            password: authToken
        },
        cancelToken: new axios.CancelToken(c => cancel = c)
    }

    const requestOptions2 = {
        auth: {
            username: accountSID,
            password: authToken
        },
        cancelToken: new axios.CancelToken(c => cancel = c)
    }

    // Make first two requests
    function custom_sort(a: resultProps, b: resultProps) {
        return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
    }
    
    var arr = []
    if(pageURI1 != null)
        arr.push(axios.get(baseURL + pageURI1, requestOptions1))
    if(pageURI2 != null)
        arr.push(axios.get(baseURL + pageURI2, requestOptions2))
    
    Promise.all(arr).then(values => {
                var combinedRes: resultProps[] = []

        if(values.length === 1){
            combinedRes = values[0].data.messages;
            if(values[0].data.next_page_uri != null){
                setHasMore(true)
            }else setHasMore(false)
            if(pageURI1 === null){
                setURI2(values[0].data.next_page_uri)
            }
            else{
                setURI1(values[0].data.next_page_uri)
            }
        }else{
            const response1 = values[0];
            const response2 = values[1];
            setURI1(response1.data.next_page_uri)
            setURI2(response2.data.next_page_uri)
            // combinedRes.push(response1.data.messages)
            // combinedRes.push(response2.data.messages)
            

            combinedRes = response1.data.messages.concat(response2.data.messages)

            if(response1.data.next_page_uri != null || response2.data.next_page_uri != null){
                setHasMore(true)
            }
            else{
                setHasMore(false)
            }
        }
        
        combinedRes.sort(custom_sort)      
        setMessageLogs(prevMessageLogs => {
            return [...prevMessageLogs, ...combinedRes]
        })

        for (let i = 0; i < values.length; i++) {
            if(values[i].data.next_page_uri != null){
                setHasMore(true)
                break;
            }
            else{
                setHasMore(false)
            }
        }
        setLoading(false)
    })   
    .catch(e => {
      if (axios.isCancel(e)) return
      if(pageURI1)
        setError(true)
        else setLoading(false)
    })
    return () => cancel()
  }, [pageURI1, pageURI2, accountSID, authToken])

  return { loading, error, messageLogs, hasMore, URI1, URI2}

}