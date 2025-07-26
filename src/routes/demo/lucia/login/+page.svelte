<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  const { form }: { form: ActionData } = $props();
</script>

<h1>Login/Register</h1>
<form action="?/login" method="post" use:enhance>
  <label>
    Username
    <input name="username" />
  </label>
  <label>
    Password
    <input name="password" type="password" />
  </label>
  <button>Login</button>
  <button formaction="?/register">Register</button>
</form>
<p style:color="red">{form?.message ?? ''}</p>
