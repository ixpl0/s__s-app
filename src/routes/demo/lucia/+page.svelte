<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageServerData } from './$types';

  const { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form action="?/logout" method="post" use:enhance>
  <button>Sign out</button>
</form>
