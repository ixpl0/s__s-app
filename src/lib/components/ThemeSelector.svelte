<script lang="ts">
  const themes = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset', 'silk'];
  type Theme = (typeof themes)[number];

  const onChange = (theme: Theme): void => {
    localStorage.setItem('theme', theme);
  };
</script>

<div class="dropdown">
  <div class="btn m-1" role="button" tabindex="0">
    Theme
    <svg
      class="inline-block h-2 w-2 fill-current opacity-60"
      height="12px"
      viewBox="0 0 2048 2048"
      width="12px"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
    </svg>
  </div>

  <ul class="dropdown-content bg-base-300 rounded-box z-1 w-lg p-2 shadow-2xl grid grid-cols-5 gap-2 mt-2">
    {#each themes as theme (theme)}
      <li>
        <input
          name="theme-dropdown"
          aria-label={theme.charAt(0)
            .toUpperCase() + theme.slice(1)}
          class="theme-controller btn btn-sm btn-block btn-ghost px-3"
          on:change={() => onChange(theme)}
          type="radio"
          value={theme}
        />
      </li>
    {/each}
  </ul>
</div>
