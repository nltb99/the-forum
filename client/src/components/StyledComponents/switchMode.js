import styled from 'styled-components'

export const Switch = styled.input`
    position: relative;
    width: 55px;
    height: 25px;
    background: #999;
    border-radius: 30px;
    -webkit-appearance: none;

    &:before {
        content: '';
        position: absolute;
        width: 50%;
        height: 100%;
        left: ${(props) => (props.mode ? '0px' : '28px')};
        top: 0;
        background: #fff;
        overflow: hidden;
        border-radius: 30px;
        transition: all 0.3s ease-in;
    }
    &:checked:before {
        content: '';
        left: ${(props) => (props.mode ? '28px' : 0)};
        background: #888;
        transition: all 0.3s ease-in;
    }
    &:checked {
        background: #fff;
        transition: all 0.3s ease-in;
    }
`

export const Day = styled.body`
    background-color: red;
`
