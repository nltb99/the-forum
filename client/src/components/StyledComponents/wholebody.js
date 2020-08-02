import { createGlobalStyle } from 'styled-components';

const WholeBody = createGlobalStyle`
body{
    background-color: ${(props) => (props.theme === 'true' ? 'white' : 'rgb(38,38,38)')};
}
`;

export default WholeBody;
