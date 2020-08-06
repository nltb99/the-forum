import styled from 'styled-components';

const InfoQuestion = styled.div`
    display: flex;
    align-items: center;
    margin-top: 4px;
    color: ${(props) =>
        props.isWhiteMode === 'false' ? 'rgb(229, 226, 221)' : 'rgb(229, 226, 221)'};
    p {
        margin-right: 10px;
    }
    hr {
        border-right: 2px solid white;
        height: 20px;
    }
`;

export default InfoQuestion;
