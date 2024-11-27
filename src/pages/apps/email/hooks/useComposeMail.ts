import { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import * as yup from 'yup';

export default function useComposeMail(toggleComposeModal: () => void) {
	const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

	/*
	 * form validation schema
	 */
	const schema = yup.object().shape({
		to: yup.string().required('Please specify to email').email('Please enter valid Email'),
		subject: yup.string().required('Please specify subject'),
	});

	/**
	 * Handles the save
	 * @param {*} event
	 * @param {*} values
	 */
	const handleEmailSave = ({ data }: any) => {
		const body = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		console.log({ ...data, body });
		toggleComposeModal();
	};

	/**
	 * On editor body change
	 */
	const onEditorStateChange = (editorStates: EditorState) => {
		setEditorState(editorStates);
	};

	return {
		editorState,
		schema,
		handleEmailSave,
		onEditorStateChange,
	};
}
