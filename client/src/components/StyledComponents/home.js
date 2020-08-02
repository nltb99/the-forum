import styled from 'styled-components';

const InfoQuestion = styled.div`
    display: flex;
    align-items: center;
    color: ${(props) => (props.isWhiteMode === 'false' ? 'white' : 'black')};
    p {
        margin-right: 10px;
    }
    hr {
        border-right: 2px solid white;
        height: 20px;
    }
`;

export default InfoQuestion;
