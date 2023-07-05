import {Theme} from '@twilio-paste/core/theme';
import { Avatar, Box, Button, Flex, Input, Label } from '@twilio-paste/core';
import React, {useState} from "react"
import {useNavigate} from 'react-router-dom';

const Login: React.FC = () => {

    const [accountSID, setAccountSID] = useState<string>('');
    const [authToken, setAuthToken] = useState<string>('');
    const navigate = useNavigate();

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate('/logs', {state: {accountSID: accountSID, authToken: authToken}});
    }
    
  return(
    <Theme.Provider theme="default">
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
        <Box width={500} margin="space100" padding="space10" >
            <form onSubmit={handleOnSubmit}>
                <Label htmlFor="accountSID" required>
                        Account SID
                </Label>
                <Input aria-describedby="accountSID" id="accountSID" name="accountSID" onChange={event => {
                        setAccountSID(event.target.value)
                    }} type="text" placeholder="ACXXXXXXXXXXXXXXX" required />
                <br/>

                <Label htmlFor="authToken" required>
                                Auth Token
                </Label>
                <Input aria-describedby="authToken" id="authToken" name="authToken" onChange={event => {
                        setAuthToken(event.target.value)
                    }} type="text" placeholder="XXXXXXXXXXXX" required />
                <br/>

                <Button type='submit' variant='primary'>Submit</Button>
            </form>
        </Box>
    </Theme.Provider>
  )
};

Login.displayName = 'Login';

export default Login;
