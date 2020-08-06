import { createGlobalStyle } from 'styled-components';

const WholeBody = createGlobalStyle`
body{
    background-color: ${(props) => (props.theme !== 'true' ? 'white' : 'rgb(229,226,221)')};
}
`;

export default WholeBody;

// rgb(38,38,38)
