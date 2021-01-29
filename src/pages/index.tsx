import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Field, FieldArray, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React from 'react';
import { array, boolean, number, object, string, ValidationError } from 'yup';

const emptyDonation = { institution: '', percentage: 0 };
const useStyles = makeStyles((theme) => ({
  errorColor: {
    color: theme.palette.error.main,
  },
  noWrap: {
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap',
    },
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={{
            fullName: '',
            donationsAmount: 0,
            termsAndConditions: false,
            donations: [emptyDonation],
          }}
          validationSchema={object({
            fullName: string()
              .required('Your name is required')
              .min(2, 'Your name needs to be at least 3 characters')
              .max(10, 'Your name needs to be at most 10 characters'),
            donationsAmount: number().required().min(10),
            termsAndConditions: boolean().required().isTrue(),
            donations: array(
              object({
                institution: string()
                  .required('Institution name needed')
                  .min(3, 'Institution name needs to be at least 3 characters')
                  .max(
                    10,
                    'Institution name needs to be at most 10 characters'
                  ),
                percentage: number()
                  .required('Percentage needed')
                  .min(1, 'Percentage needs to be at least 1%')
                  .max(100, 'Percentage can be at most 100%'),
              })
            )
              .min(1, 'You need to provide at least 1 institution')
              .max(3, 'You can only provide 3 institution')
              .test((donations: Array<{ percentage: number }>) => {
                const sum = donations.reduce(
                  (acc, curr) => acc + curr.percentage,
                  0
                );

                if (sum !== 100) {
                  return new ValidationError(
                    `Percentage should be 100%, but you have ${sum}%`,
                    undefined,
                    'donations'
                  );
                }

                return true;
              }),
          })}
          onSubmit={async (values) => {
            console.log('my values', values);
            return new Promise((res) => setTimeout(res, 2500));
          }}
        >
          {({ values, errors, isSubmitting, isValid }) => (
            <Form autoComplete="off">
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Field
                    fullWidth
                    name="fullName"
                    component={TextField}
                    label="Full Name"
                  />
                </Grid>

                <Grid item>
                  <Field
                    fullWidth
                    name="donationsAmount"
                    type="number"
                    component={TextField}
                    label="Donation (£)"
                  />
                </Grid>

                <FieldArray name="donations">
                  {({ push, remove }) => (
                    <React.Fragment>
                      <Grid item>
                        <Typography variant="body2">
                          All your donations
                        </Typography>
                      </Grid>

                      {values.donations.map((_, index) => (
                        <Grid
                          container
                          item
                          className={classes.noWrap}
                          key={index}
                          spacing={2}
                        >
                          <Grid item container spacing={2} xs={12} sm="auto">
                            <Grid item xs={12} sm={6}>
                              <Field
                                fullWidth
                                name={`donations.${index}.institution`}
                                component={TextField}
                                label="Institution"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Field
                                fullWidth
                                name={`donations[${index}].percentage`}
                                component={TextField}
                                type="number"
                                label="Percentage (%)"
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm="auto">
                            <Button
                              disabled={isSubmitting}
                              onClick={() => remove(index)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      ))}

                      <Grid item>
                        {typeof errors.donations === 'string' ? (
                          <Typography color="error">
                            {errors.donations}
                          </Typography>
                        ) : null}
                      </Grid>

                      <Grid item>
                        <Button
                          disabled={isSubmitting}
                          variant="contained"
                          onClick={() => push(emptyDonation)}
                        >
                          Add Donation
                        </Button>
                      </Grid>
                    </React.Fragment>
                  )}
                </FieldArray>

                <Grid item>
                  <Field
                    name="termsAndConditions"
                    type="checkbox"
                    component={CheckboxWithLabel}
                    Label={{
                      label: 'I accept the terms and conditions',
                      className: errors.termsAndConditions
                        ? classes.errorColor
                        : undefined,
                    }}
                  />
                </Grid>

                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size="0.9rem" />
                      ) : undefined
                    }
                  >
                    {isSubmitting ? 'Submitting' : 'Submit'}
                  </Button>
                </Grid>
              </Grid>

              <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
