'use client'
import * as React from 'react';
import Link from 'next/link'
import Messages from './messages'
import { Box, Button, Checkbox, FormControlLabel, Grid, Input, TextField } from '@mui/material'
import { red } from '@mui/material/colors'
import { CheckBox } from '@mui/icons-material'
import { ChangeEvent } from 'react'

export default function Login() {
  const [checked, setChecked] = React.useState(true);
  function handleChange(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
    console.warn(checked)
    setChecked(event.target.checked);
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action="/auth/sign-in"
        method="post">

        <TextField
          required
          id="outlined-required"
          label="Email"
          defaultValue="id@loschool.com"
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />

        <Button type="submit" variant="outlined" color="primary">
          Sign In
        </Button>

        <FormControlLabel
          control={
            <Checkbox checked={checked} onChange={handleChange} name="Remember Me" />
          }
          label="Remember Me"
        />

        <Grid container>
          <Grid item xs>
            <Link href="#">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
        <Messages />
      </form>
    </div>
  )
}
