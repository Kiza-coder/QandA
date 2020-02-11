import { PrimaryButton } from './Styles';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { QuestionList } from './QuestionList';
import { QuestionsData } from './QuestionsData';
import {Page} from './Page'
import {PageTitle} from './PageTitle'
import {useEffect, FC} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {connect} from 'react-redux'
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {
    getUnansweredQuestionsActionCreator,
    AppState
    } from './Store';



const renderQuestion = (question: QuestionsData) => 
    <div>{question.title}</div>;

interface Props extends RouteComponentProps {
        getUnansweredQuestions: () => Promise<void>;
        questions: QuestionsData[] | null;
        questionsLoading: boolean;
        }


const HomePage:FC<Props> = ({history,questions,questionsLoading,getUnansweredQuestions}) =>{

    useEffect(() => {
        if (questions === null) {
            getUnansweredQuestions();
            }
    
    },[questions,getUnansweredQuestions])

    const handleAskQuestionClick = () => {
        history.push('/ask')        
    }
    return(
        <Page>
    <div
    css={css`
    display: flex;
    margin: 50px auto 20px auto;
    padding: 30px 20px;
    max-width: 600px;
    `}>
        <PageTitle
        css={css`
        flex: 1;
        margin-left:10px;
        font-size: 15px;
        font-weight: bold;
        margin: 10px 0px 5px;
        text-align: center;
        text-transform: uppercase;
        `}>Unanswered Questions</PageTitle>
        <PrimaryButton onClick={handleAskQuestionClick}>
            Ask a question 
        </PrimaryButton>
        </div>
        {questionsLoading ? (
            <div
            css={css`
            font-size: 16px;
            font-style: italic;
            `}>
            Loading....
            </div>) : (
                <QuestionList data={questions || []}/>
            )
        }
    
</Page>
    )
}


const mapStateToProps = (store: AppState) => {
    return{
        questions: store.questions.unanswered,
        questionsLoading: store.questions.loading
    }
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AnyAction>,) => {
    return{
    getUnansweredQuestions: () =>
    dispatch(getUnansweredQuestionsActionCreator()),
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(HomePage);
