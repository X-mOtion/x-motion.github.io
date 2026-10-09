const citations = {
  movt: `@inproceedings{jing2026movt,
  title = {MoVT: Video-Augmented Motion Tokenizer for Text-to-Motion Generation},
  author = {Jing, Beibei and Guo, Tianle and Zhang, Youjia and Song, Zikai and Luo, Yawei and Yu, Junqing and Guan, Tao and Yang, Wei},
  booktitle = {Proceedings of the 34th ACM International Conference on Multimedia},
  year = {2026},
  doi = {10.1145/3767308.3834990},
  url = {https://arxiv.org/abs/2609.14965}
}`,
  amd: `@inproceedings{jing2024amd,
  title = {AMD: Anatomical Motion Diffusion with Interpretable Motion Decomposition and Fusion},
  author = {Jing, Beibei and Zhang, Youjia and Song, Zikai and Yu, Junqing and Yang, Wei},
  booktitle = {Proceedings of the AAAI Conference on Artificial Intelligence},
  volume = {38},
  number = {3},
  pages = {2643--2651},
  year = {2024},
  doi = {10.1609/aaai.v38i3.28042}
}`
,
  "image": "@article{jing2022image,\n  title = {Image generation step by step: animation generation-image translation},\n  author = {Jing, Beibei and Ding, Hongwei and Yang, Zhijun and Li, Bo and Liu, Qianlin},\n  journal = {Applied Intelligence},\n  volume = {52},\n  number = {7},\n  pages = {8087--8100},\n  year = {2022},\n  doi = {10.1007/s10489-021-02835-z}\n}",
  "video": "@article{jing2022video,\n  title = {Video prediction: a step-by-step improvement of a video synthesis network},\n  author = {Jing, Beibei and Ding, Hongwei and Yang, Zhijun and Li, Bo and Bao, Liyong},\n  journal = {Applied Intelligence},\n  volume = {52},\n  number = {4},\n  pages = {3640--3652},\n  year = {2022},\n  doi = {10.1007/s10489-021-02500-5}\n}",
  "denoise": "@article{jing2021denoising,\n  title = {Image double blind denoising algorithm combining with denoising convolutional neural network and conditional generative adversarial net},\n  author = {Jing, Beibei and Guo, Jia and Wang, Liqing and Chen, Jing and Ding, Hongwei},\n  journal = {Journal of Computer Applications},\n  volume = {41},\n  number = {6},\n  pages = {1767--1774},\n  year = {2021},\n  doi = {10.11772/j.issn.1001-9081.2020091355}\n}"
};
let toastTimeout;
function toast(message) {
  const element = document.querySelector('#toast');
  if (!element) return;
  (document.querySelector('dialog[open]') || document.body).append(element);
  clearTimeout(toastTimeout); element.textContent = message; element.classList.add('visible');
  toastTimeout = setTimeout(() => element.classList.remove('visible'), 2400);
}
async function copyText(value) {
  try { await navigator.clipboard.writeText(value); return true; }
  catch {
    const field = document.createElement('textarea'); field.value = value;
    field.style.cssText = 'position:fixed;top:0;left:-9999px'; document.body.append(field);
    field.select(); const result = document.execCommand('copy'); field.remove(); return result;
  }
}
document.querySelector('#copy-email')?.addEventListener('click', async () => {
  toast(await copyText('jingbeibei.ghyn@gmail.com') ? 'Email copied' : 'Please select and copy the email address.');
});
let activeCitation = ''; let citationURL;
document.querySelectorAll('[data-citation]').forEach(button => button.addEventListener('click', () => {
  activeCitation = citations[button.dataset.citation];
  document.querySelector('#citation-text').textContent = activeCitation;
  if (citationURL) URL.revokeObjectURL(citationURL);
  citationURL = URL.createObjectURL(new Blob([activeCitation + '\n'], {type:'application/x-bibtex'}));
  const download = document.querySelector('#download-citation');
  download.href = citationURL; download.download = `${button.dataset.citation}.bib`;
  document.querySelector('#citation-dialog').showModal();
}));
document.querySelector('#copy-citation')?.addEventListener('click', async () => {
  toast(await copyText(activeCitation) ? 'BibTeX copied' : 'Please select and copy the citation text.');
});
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => document.querySelector('#demo-dialog').showModal()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.querySelector('video')?.pause());
});
document.querySelector('#print-cv')?.addEventListener('click', () => window.print());
