
import { Page } from './Page'
import {Form,required,minLength,Values,SubmitResult} from './Form'
import {Field} from './Field'
import React, { FC, useEffect } from 'react';
import { PostQuestionData, QuestionsData } from './QuestionsData';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
postQuestionActionCreator,
AppState,
clearPostedQuestionActionCreator
} from './Store';
import { AnyAction } from 'redux';

interface Props {
    postQuestion: (
    question: PostQuestionData,
    ) => Promise<void>;
    postedQuestionResult?: QuestionsData;
    clearPostedQuestion: () => void;
    }

const AskPage:FC<Props> =  ({postQuestion,
    postedQuestionResult,
    clearPostedQuestion}) => {

    useEffect(() => {
        return function cleanUp() {
        clearPostedQuestion();
        };
    }, [clearPostedQuestion]);

    const handleSubmit = (values: Values) => {
        postQuestion({
            title: values.title,
            content: values.content,
            userName: "Fred",
            created: new Date()
        })
    }

    let submitResult: SubmitResult | undefined;
        if (postedQuestionResult) {
            submitResult = { success: postedQuestionResult !== undefined };
    }

        
    


    return (
        <Page title="Ask a question">
            <Form submitCaption="Submit your question"
            onSubmit={handleSubmit}
            submitResult={submitResult}
            validationRules={{
                title: [
                { validator: required },
                { validator: minLength, arg: 10 },
                ],
                content: [
                { validator: required },
                { validator: minLength, arg: 50 },
                ],
                }}
                failureMessage="There was a problem with your question"
                succesMessage="Your Question was successfully submitted">
                <Field name='title' label='Title' type="text" />
                <Field name='content' label="Content" type="TextArea" />   
            </Form>
        </Page>
    )
}

const mapStateToProps = (store: AppState) => {
    return {
    postedQuestionResult: store.questions.postedResult,
    };
    };

const mapDispatchToProps = (
        dispatch: ThunkDispatch<any, any, AnyAction>,
        ) => {
        return {
        postQuestion: (question: PostQuestionData) =>
        dispatch(postQuestionActionCreator(question)),
        clearPostedQuestion: () =>
        dispatch(clearPostedQuestionActionCreator()),
    };
};

export default connect(
mapStateToProps,
mapDispatchToProps,
)(AskPage);

