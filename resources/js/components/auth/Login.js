import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch } from 'react-redux';

const Login = () => {

  const dispatch = useDispatch();
  const initialValues = {};

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
  };

  return (
    <div
      className="form-container"
      style={{ background: 'white' }}
    >
      <div className="form-form">
        <div className="form-form-wrap">
          <div className="form-container">
            <div className="form-content">
              <img src='../img/centevi.png' alt="Logo" className="mb-3" style={{ maxWidth: '800px', display: 'block', margin: '0 auto' }} />
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
              >
                {/* <form className="text-left mt-2"> */}
                {({ setFieldValue, resetForm }) => (
                  <Form
                    method="post"
                    role="form"
                  >
                    <div className="form">
                      <div id="username-field" className="field-wrapper input">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <Field
                          className="form-control"
                          id="username"
                          name="username"
                          placeholder="Username"
                          required
                          as="input"
                        />
                      </div>
                      <div id="password-field" className="field-wrapper input mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <Field
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Password"
                          required
                          as="input"
                          type="password"
                        />
                      </div>
                      <div className="d-sm-flex justify-content-between">
                        <div className="field-wrapper toggle-pass">
                          <p className="d-inline-block">Mostrar Contraseña</p>
                          <label className="switch s-primary">
                            <input type="checkbox" id="toggle-password" className="d-none" />
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <div className="field-wrapper">
                          <button type="submit" className="btn btn-primary" value="">Ingresar</button>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
                {/* </form> */}
              </Formik>

              {/* <p className="terms-conditions">© 2020 All Rights Reserved. <a href="index.html">CORK</a> is a product of Designreset. <a href="javascript:void(0);">Cookie Preferences</a>, <a href="javascript:void(0);">Privacy</a>, and <a href="javascript:void(0);">Terms</a>.</p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="form-image">
        <div className="l-image">
        </div>
      </div>
    </div>
  );
}

export default Login;
