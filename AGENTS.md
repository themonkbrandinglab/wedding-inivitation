<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep wedding ceremony dates, times, venues, addresses, and names in `src/lib/wedding-data.ts`; all invitation displays and outbound links derive from it to prevent conflicting details.
- Store guest RSVPs in the insert-only Cloud table `public.wedding_rsvps`; public guests cannot read submissions, protecting their messages and names.
- Use generated photographic scene assets for realistic architecture and materials, reserving lightweight React Three Fiber for the interactive oil flame so the mobile invitation stays performant.
