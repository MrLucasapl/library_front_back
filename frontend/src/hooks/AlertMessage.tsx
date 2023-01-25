import { Alert, AlertColor } from '@mui/material';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import React from 'react';

interface MessageModal {
	content: string;
	display: boolean;
	severity: AlertColor;
}

export const useMessage = ()=>{
	const [ message, setMessage ] = React.useState<MessageModal>({content: '', display: false, severity: 'success'});
	
	const AlertMessage = () => {
		return (
			<Snackbar autoHideDuration={3000} open={message.display}>
				<Alert style={{ width: '100%' }} severity={message.severity}>
					{message.content}
				</Alert>
			</Snackbar>
		);
	};

	return {
		message, 
		setMessage,
		AlertMessage
	};
};