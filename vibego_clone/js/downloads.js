(() => {
  'use strict';
  const root = 'https://vibegoconect.com/vibego/downloads/';
  const platforms = {
    windows: { label: 'Windows', file: 'VibeGO-Conect-Windows-2.4.0.msi', instruction: 'Instale o MSI e abra VibeGO Conect no menu Iniciar.' },
    macos: { label: 'Mac', file: 'VibeGO-Conect-Mac.zip', instruction: 'Extraia o ZIP e abra VibeGO Conect.app para iniciar o VibeGO Conect.' },
    linux: { label: 'Linux', file: 'VibeGO-Conect-Linux.tar.gz', instruction: 'Extraia o arquivo e abra Abrir-VibeGO-Conect.sh para iniciar o VibeGO Conect.' }
  };
  const agent = navigator.userAgent;
  const mobile = /Android|iPhone|iPad|iPod/i.test(agent) || (/Mac/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
  const detected = mobile ? 'windows' : /Mac/i.test(navigator.userAgentData?.platform || navigator.platform) ? 'macos' : /Linux/i.test(navigator.userAgentData?.platform || navigator.platform) ? 'linux' : 'windows';
  document.querySelectorAll('[data-download-widget]').forEach(widget => {
    const select = widget.querySelector('[data-download-os]');
    select.value = detected;
    const update = () => {
      const platform = platforms[select.value] || platforms.windows;
      const link = widget.querySelector('[data-download-link]');
      link.href = root + platform.file;
      link.download = platform.file;
      widget.querySelector('[data-download-label]').textContent = 'Baixar para ' + platform.label;
      widget.querySelector('[data-download-instruction]').textContent = platform.instruction;
      widget.querySelector('[data-download-mobile]').hidden = !mobile;
      widget.querySelector('[data-download-preview]').hidden = select.value !== 'macos';
    };
    select.addEventListener('change', update);
    update();
  });
})();
