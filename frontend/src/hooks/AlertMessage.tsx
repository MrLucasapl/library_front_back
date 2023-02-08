import { Alert, AlertColor } from '@mui/material';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import React from 'react';

interface MessageModal {
	content: string;
	display: boolean;
	severity: AlertColor;
}

export const useMessage = () => {
	const [message, setMessage] = React.useState<MessageModal>({ content: '', display: false, severity: 'success' });

	message.display &&
		setTimeout(() => {
			setMessage({ content: '', display: false, severity: 'success' });
		}, 3000);

	const AlertMessage = () => {
		return (
			<Snackbar open={message.display}>
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
