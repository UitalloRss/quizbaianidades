import React from 'react';

export default function PaginaDeOutrosQuiz(){
    return(
        <div>
            Calma, isso vai ficar pronto logo, logo.
        </div>
    );
}

export async function getServerSideProps(context){
    console.log('Informações do Next', context.query)
    return{
        props: {},
    };
}