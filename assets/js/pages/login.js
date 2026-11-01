/* Nusumo — Sign in */
N.ready(function () {
  const D = N.D;
  const appHost = document.getElementById('app');
  appHost.outerHTML = `<div class="auth">
    <div class="auth__art">
      <div class="auth__pitch">
        <div class="brand" style="margin-bottom:28px"><span class="brand__mark">N</span><span class="brand__name">Nusumo</span></div>
        <h1>A home for <em>creators</em> and the people who love their work.</h1>
        <p>Stream live, host audio rooms, share reels and posts, and build a community around the things you make. No algorithm deciding what gets seen.</p>
        <div class="auth__proof">
          <div class="av-stack">${['ayesha','rafi','farah','kavita'].map(id => N.av(id, 26, 'av--hair')).join('')}</div>
          <span>Joined by 120K+ creators this year</span>
        </div>
      </div>
    </div>
    <div class="auth__form-side">
      <div class="auth__card">
        <h2>Welcome back</h2>
        <div class="sub">Sign in to your Nusumo account.</div>
        <form data-form>
          <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" placeholder="you@nusumo.app" autocomplete="email"></div>
          <div class="field"><label for="password">Password</label><input class="input" id="password" name="password" type="password" placeholder="••••••••" autocomplete="current-password"></div>
          <div class="row" style="justify-content:space-between;margin-bottom:16px">
            <label class="row" style="gap:6px;font-size:11.5px;color:var(--muted)"><input type="checkbox" checked> Remember me</label>
            <a href="#" style="font-size:11.5px;color:var(--violet-soft)">Forgot password?</a>
          </div>
          <button class="btn btn--primary btn--block" type="submit">${N.ic('lock')}Sign in</button>
        </form>
        <div class="auth__divider">or continue with</div>
        <div class="row" style="gap:8px">
          <button class="btn btn--ghost" style="flex:1" data-oauth="Google">${N.ic('globe')}Google</button>
          <button class="btn btn--ghost" style="flex:1" data-oauth="Apple">${N.ic('apple' in N.ic ? 'apple' : 'user')}Apple</button>
        </div>
        <div class="auth__foot">New to Nusumo? <a href="#" data-signup>Create an account</a></div>
      </div>
    </div>
  </div>`;
  N.reveal();
  wire();
});

function wire() {
  const form = document.querySelector('[data-form]');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    N.toast('Signing in…');
    setTimeout(() => { location.href = 'index.html'; }, 700);
  });
  document.querySelectorAll('[data-oauth]').forEach(b => b.addEventListener('click', () => N.toast(b.dataset.oauth + ' sign-in coming soon')));
  document.querySelectorAll('[data-signup]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); N.toast('Sign up flow coming soon'); }));
}