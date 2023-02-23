import { Alert, AlertColor } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

interface MessageModal {
	content: string;
	severity: AlertColor;
}

interface MessageOptions {
	timeout?: number;
}

interface MessageHook {
	showMessage: (content: string, severity: AlertColor, options?: MessageOptions) => void;
	AlertMessage: React.FC;
}

export const useMessage = (): MessageHook => {
	const [message, setMessage] = React.useState<MessageModal>({ content: '', severity: 'success' });

	const closeMessage = React.useCallback(() => {
		setMessage({ content: '', severity: 'success' });
	}, []);

	const AlertMessage: React.FC = () => {
		const { content, severity } = message;

		return (
			<Snackbar open={Boolean(content)}>
				<Alert style={{ width: '100%' }} severity={severity}>
					{content}
				</Alert>
			</Snackbar>
		);
	};

	const showMessage = React.useCallback(
		(content: string, severity: AlertColor, options?: MessageOptions) => {
			const { timeout = 3000 } = options || {};
			setMessage({ content, severity });
			setTimeout(closeMessage, timeout);
		},
		[closeMessage]
	);

	return { showMessage, AlertMessage };
};
