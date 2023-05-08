import styled from "styled-components";

const Contact = () => {

  const Wrapper = styled.section`
    padding: 0;
    text-align: center;

    .container {
      margin-top: 6rem;

      .contact-form {
        max-width: 50rem;
        margin: auto;

        .contact-inputs {
          display: flex;
          flex-direction: column;
          gap: 3rem;

          input[type="submit"] {
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background-color: "dark";
              border: 1px solid "black";
              color: "black";
              transform: scale(0.9);
            }
          }
        }
      }
    }
  `;

  return (
    <Wrapper>
      <iframe
        src="https://maps.google.com/maps?width=866&amp;height=607&amp;hl=en&amp;q=CANIFA 109 PHẠM NGŨ LÃO HẢI DƯƠNG&amp;t=&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"></iframe>
    </Wrapper>
  );
};

export default Contact;
