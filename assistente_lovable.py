"""
Assistente Lovable - versão patchright (Python)
Alvo: Windows 11, Chrome real instalado em C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe
Motivo da troca de puppeteer/playwright puro para patchright:
Playwright (e puppeteer) deixam o domínio Runtime.enable do CDP ligado por padrão na sessão,
o que vaza timing/stack-trace detectável por anti-bot (era isso que derrubava o Turnstile/checagens
de risco mesmo com todas as flags de automação desligadas). Patchright é um fork do Playwright que
corrige esse vazamento na camada do driver, então nenhum patch de JS na página é necessário.
"""

import argparse
import imaplib
import email
import json
import os
import random
import re
import string
import sys
import time
import unicodedata
from datetime import datetime
from pathlib import Path

from patchright.sync_api import sync_playwright

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / 'config.json'
TOKENS_TXT = BASE_DIR / 'tokens_capturados.txt'
DESKTOP_ACCOUNTS_JSON = Path('C:/Users/ShadezinX/Desktop/accounts.json')
DESKTOP_TOKENS_TXT = Path('C:/Users/ShadezinX/Desktop/tokens_capturados.txt')
CHROME_PATH = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
PERFIS_DIR = BASE_DIR / 'perfis_chrome'

CONTAS_FIXAS = [
    {'id': 1, 'nome': 'Eugênio (Você)', 'email': 'eugenio@obsidien.online'},
    {'id': 2, 'nome': 'Marta (Esposa)', 'email': 'marta@obsidien.online'},
    {'id': 3, 'nome': 'Alfredo (Filho)', 'email': 'alfredo@obsidien.online'},
    {'id': 4, 'nome': 'Dino', 'email': 'dino@obsidien.online'},
]

PRIMEIROS_NOMES = [
    'Lucas', 'Gabriel', 'Mateus', 'Felipe', 'Rafael', 'Bruno', 'Leonardo',
    'Thiago', 'Rodrigo', 'Daniel', 'Marcos', 'Andre', 'Eduardo', 'Caio',
    'Vitor', 'Gustavo', 'Diego', 'Renato', 'Danilo', 'Arthur', 'Samuel',
    'Bernardo', 'Heitor', 'Davi', 'Lorenzo', 'Theo', 'Benjamin', 'Pedro',
    'Alex', 'Hugo', 'Enzo', 'Joao', 'Marcelo', 'Murilo', 'Otavio',
    'Juliana', 'Camila', 'Beatriz', 'Mariana', 'Larissa', 'Leticia',
    'Fernanda', 'Aline', 'Amanda', 'Bruna', 'Carolina', 'Debora',
    'Natalia', 'Vanessa', 'Jessica', 'Bianca', 'Patricia', 'Renata',
]

SOBRENOMES = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
    'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
    'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha',
    'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado',
    'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Goncalves', 'Santana', 'Teixeira',
]


# ---------------------------------------------------------------------------
# Geração de contas / senhas
# ---------------------------------------------------------------------------

def gerar_senha_aleatoria():
    maiusculas = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    minusculas = 'abcdefghjkmnpqrstuvwxyz'
    numeros = '23456789'
    simbolos = '!@#$%&*'
    todos = maiusculas + minusculas + numeros + simbolos

    senha = [
        random.choice(maiusculas),
        random.choice(minusculas),
        random.choice(numeros),
        random.choice(simbolos),
    ]
    senha += [random.choice(todos) for _ in range(8)]
    random.shuffle(senha)
    return ''.join(senha)


def gerar_contas_aleatorias(qtd):
    lista = []
    emails_gerados = set()
    for i in range(1, qtd + 1):
        primeiro = random.choice(PRIMEIROS_NOMES)
        sobrenome = random.choice(SOBRENOMES)
        nome_completo = f'{primeiro} {sobrenome}'
        base_email = unicodedata.normalize('NFD', f'{primeiro}{sobrenome}'.lower())
        base_email = ''.join(c for c in base_email if unicodedata.category(c) != 'Mn')
        email_final = f'{base_email}@obsidien.online'
        if email_final in emails_gerados:
            email_final = f'{base_email}{random.randint(10, 98)}@obsidien.online'
        emails_gerados.add(email_final)
        lista.append({
            'id': i,
            'nome': nome_completo,
            'email': email_final,
            'senha': gerar_senha_aleatoria(),
        })
    return lista


def carregar_config():
    if CONFIG_PATH.exists():
        try:
            return json.loads(CONFIG_PATH.read_text(encoding='utf-8'))
        except Exception:
            pass
    return {'gmailUser': 'developermax2maker@gmail.com', 'gmailAppPassword': 'cubklsjqsbzrlkwz'}


def salvar_conta_com_token(email_conta, token, refresh_token, nome, senha):
    contas_json = []
    if DESKTOP_ACCOUNTS_JSON.exists():
        try:
            contas_json = json.loads(DESKTOP_ACCOUNTS_JSON.read_text(encoding='utf-8'))
            if not isinstance(contas_json, list):
                contas_json = []
        except Exception:
            contas_json = []

    contas_json = [c for c in contas_json if c.get('email', '').lower() != email_conta.lower()]
    contas_json.append({
        'email': email_conta,
        'name': nome,
        'password': senha,
        'token': token,
        'accessToken': token,
        'refreshToken': refresh_token,
        'createdAt': datetime.utcnow().isoformat() + 'Z',
    })

    try:
        DESKTOP_ACCOUNTS_JSON.write_text(json.dumps(contas_json, indent=2, ensure_ascii=False), encoding='utf-8')
        print('\n[ARQUIVO] Conta salva com sucesso no Desktop -> accounts.json (Senha salva!)')
    except Exception as err:
        print(f'\n[ERRO] Falha ao gravar accounts.json no Desktop: {err}')

    linha = f"{email_conta}|{senha}|{token or 'sem_token'}\n"
    try:
        with open(TOKENS_TXT, 'a', encoding='utf-8') as f:
            f.write(linha)
    except Exception:
        pass
    try:
        with open(DESKTOP_TOKENS_TXT, 'a', encoding='utf-8') as f:
            f.write(linha)
        print('[ARQUIVO] Salvo com sucesso no Desktop -> tokens_capturados.txt')
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Gmail (IMAP) - equivalente ao gmail_helper.js
# ---------------------------------------------------------------------------

LINK_REGEX = re.compile(r'https://lovable\.dev/auth/action\?mode=verifyEmail[^\s"\'>\\]+', re.IGNORECASE)


def _conectar_imap(user, app_password):
    clean_password = app_password.replace(' ', '')
    imap = imaplib.IMAP4_SSL('imap.gmail.com', 993)
    imap.login(user, clean_password)
    imap.select('INBOX')
    return imap


def testar_conexao_gmail(user, app_password):
    try:
        imap = _conectar_imap(user, app_password)
        imap.logout()
        return {'ok': True}
    except Exception as err:
        return {'ok': False, 'error': str(err)}


def _buscar_uids(imap, de=None, para=None):
    criterios = []
    if de:
        criterios += ['FROM', f'"{de}"']
    if para:
        criterios += ['TO', f'"{para}"']
    if not criterios:
        criterios = ['ALL']
    typ, data = imap.uid('search', None, *criterios)
    if typ != 'OK' or not data or not data[0]:
        return []
    return [int(x) for x in data[0].split()]


def obter_estado_antes(user, app_password, email_destino):
    try:
        imap = _conectar_imap(user, app_password)
        uids_gerais = _buscar_uids(imap, de='lovable.dev')
        max_uid_geral = max(uids_gerais) if uids_gerais else 0

        max_uid_destino = 0
        if email_destino:
            uids_destino = _buscar_uids(imap, de='lovable.dev', para=email_destino.lower().strip())
            max_uid_destino = max(uids_destino) if uids_destino else 0

        imap.logout()
        return {'maxUidGeral': max_uid_geral, 'maxUidDestino': max_uid_destino}
    except Exception:
        return {'maxUidGeral': 0, 'maxUidDestino': 0}


def _extrair_corpo_e_link(imap, uid):
    typ, data = imap.uid('fetch', str(uid), '(RFC822)')
    if typ != 'OK' or not data or not data[0]:
        return None, ''
    msg = email.message_from_bytes(data[0][1])
    corpo = ''
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            if ctype in ('text/plain', 'text/html'):
                try:
                    corpo += part.get_payload(decode=True).decode(part.get_content_charset() or 'utf-8', errors='ignore')
                except Exception:
                    pass
    else:
        try:
            corpo = msg.get_payload(decode=True).decode(msg.get_content_charset() or 'utf-8', errors='ignore')
        except Exception:
            corpo = str(msg.get_payload())

    match = LINK_REGEX.search(corpo)
    if not match:
        return None, corpo
    link = match.group(0).replace('&amp;', '&')
    link = re.sub(r'[.,;)]+$', '', link)
    return link, corpo


def aguardar_link_verificacao(user, app_password, email_destino, estado_antes, timeout_segundos=120):
    email_alvo = (email_destino or '').lower().strip()
    max_uid_geral_antes = estado_antes.get('maxUidGeral', 0)
    max_uid_destino_antes = estado_antes.get('maxUidDestino', 0)

    print('\n' + '=' * 60)
    print('[IMAP] MONITORANDO CHEGADA DO NOVO E-MAIL DE VERIFICAÇÃO')
    print(f'[IMAP] Conta Alvo: {email_alvo}')
    print(f'[IMAP] UID Anterior Geral: {max_uid_geral_antes} | UID Anterior Conta: {max_uid_destino_antes}')
    print(f'[IMAP] Tempo Limite: {timeout_segundos}s')
    print('=' * 60)

    imap = _conectar_imap(user, app_password)
    inicio = time.time()

    try:
        while time.time() - inicio < timeout_segundos:
            try:
                imap.noop()
            except Exception:
                pass

            if email_alvo:
                try:
                    uids_destino = _buscar_uids(imap, de='lovable.dev', para=email_alvo)
                    novos = [u for u in uids_destino if u > max_uid_destino_antes]
                    if novos:
                        link, _ = _extrair_corpo_e_link(imap, max(novos))
                        if link:
                            print('\n[IMAP] >>> SUCESSO! Última mensagem identificada por destinatário!')
                            return link
                except Exception:
                    pass

            try:
                uids_gerais = _buscar_uids(imap, de='lovable.dev')
                novos_gerais = sorted([u for u in uids_gerais if u > max_uid_geral_antes], reverse=True)
                for uid in novos_gerais:
                    link, corpo = _extrair_corpo_e_link(imap, uid)
                    if link:
                        bate = (not email_alvo) or (email_alvo in corpo.lower()) or len(novos_gerais) == 1
                        if bate:
                            print('\n[IMAP] >>> SUCESSO! Última mensagem identificada por novo UID!')
                            return link
            except Exception:
                pass

            decorrido = int(time.time() - inicio)
            sys.stdout.write(f'\r[IMAP] Aguardando a ÚLTIMA mensagem de verificação para {email_alvo}... ({decorrido}s / {timeout_segundos}s) ')
            sys.stdout.flush()
            time.sleep(2)

        print('\n[IMAP] Tempo de espera excedido. Buscando a ÚLTIMA mensagem absoluta da Lovable no inbox...')
        try:
            uids = _buscar_uids(imap, de='lovable.dev')
            if uids:
                link, _ = _extrair_corpo_e_link(imap, max(uids))
                if link:
                    return link
        except Exception:
            pass
        return None
    finally:
        try:
            imap.logout()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Humanização: mouse em curva de Bézier + clique por texto com espera
# ---------------------------------------------------------------------------

_ultima_posicao = {}


def _curva_bezier(t, p0, p1, p2, p3):
    u = 1 - t
    x = u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0]
    y = u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1]
    return x, y


def mover_mouse_humano(page, destino):
    origem = _ultima_posicao.get(id(page), (
        destino[0] + random.randint(-200, 200),
        destino[1] + random.randint(-150, 150),
    ))

    ctrl1 = (
        origem[0] + (destino[0] - origem[0]) * random.uniform(0.2, 0.5) + random.randint(-60, 60),
        origem[1] + (destino[1] - origem[1]) * random.uniform(0.2, 0.5) + random.randint(-60, 60),
    )
    ctrl2 = (
        origem[0] + (destino[0] - origem[0]) * random.uniform(0.6, 0.9) + random.randint(-60, 60),
        origem[1] + (destino[1] - origem[1]) * random.uniform(0.6, 0.9) + random.randint(-60, 60),
    )

    passos = random.randint(18, 32)
    for i in range(1, passos + 1):
        t = i / passos
        t_suave = 2 * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 2) / 2
        x, y = _curva_bezier(t_suave, origem, ctrl1, ctrl2, destino)
        page.mouse.move(x, y)
        time.sleep(random.uniform(0.004, 0.016))

    _ultima_posicao[id(page)] = destino


def clicar_humano(page, locator):
    try:
        box = locator.bounding_box()
    except Exception:
        return False
    if not box:
        return False

    destino = (
        box['x'] + box['width'] * random.uniform(0.3, 0.7),
        box['y'] + box['height'] * random.uniform(0.3, 0.7),
    )
    mover_mouse_humano(page, destino)
    time.sleep(random.uniform(0.08, 0.22))
    page.mouse.down()
    time.sleep(random.uniform(0.04, 0.12))
    page.mouse.up()
    return True


def clicar_humano_por_seletor(page, seletor):
    try:
        loc = page.locator(seletor).first
        if loc.count() == 0:
            return False
        return clicar_humano(page, loc)
    except Exception:
        return False


def _achar_por_texto(page, textos):
    alvo = [t.lower() for t in textos]
    candidatos = page.locator('button, div[role="button"], span, div, p')
    try:
        total = candidatos.count()
    except Exception:
        return None
    for i in range(total):
        el = candidatos.nth(i)
        try:
            txt = (el.inner_text() or '').strip().lower()
        except Exception:
            continue
        if txt in alvo:
            try:
                if el.is_disabled():
                    continue
            except Exception:
                pass
            return el
    return None


def clicar_humano_por_texto(page, textos):
    el = _achar_por_texto(page, textos)
    if not el:
        return False
    return clicar_humano(page, el)


def aguardar_e_clicar_por_texto(page, textos, timeout_ms=15000):
    inicio = time.time()
    while (time.time() - inicio) * 1000 < timeout_ms:
        if clicar_humano_por_texto(page, textos):
            print(f'[CLIQUE] Botão "{textos[0]}" encontrado e clicado com sucesso.')
            return True
        time.sleep(0.5)
    print(f'[!] AVISO: não encontrei nenhum botão com texto {textos} em {timeout_ms}ms.')
    return False


SELETOR_NOME = 'input[name="fullName"], input[name="name"], input[placeholder*="name" i], input[autocomplete="name"], input[type="text"]'


def preencher_nome_com_confirmacao(page, nome, tentativas=3):
    for tent in range(1, tentativas + 1):
        try:
            page.wait_for_selector(SELETOR_NOME, timeout=10000, state='visible')
            loc = page.locator(SELETOR_NOME).first
            clicar_humano(page, loc)
            loc.click(click_count=3)
            page.keyboard.press('Backspace')
            page.keyboard.type(nome, delay=random.randint(45, 120))

            page.evaluate(
                """(seletor) => {
                    const inp = document.querySelector(seletor);
                    if (inp) {
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                        inp.dispatchEvent(new Event('change', { bubbles: true }));
                        inp.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                }""",
                SELETOR_NOME,
            )

            valor_atual = loc.input_value()
            if valor_atual and valor_atual.strip():
                return valor_atual
            print(f'[!] Tentativa {tent}: campo de nome ficou vazio, tentando de novo...')
            time.sleep(1.5)
        except Exception as e:
            print(f'[!] Tentativa {tent} de preencher o nome falhou: {e}')
            time.sleep(1.5)
    return None


# ---------------------------------------------------------------------------
# Fluxo principal de cadastro
# ---------------------------------------------------------------------------

TOKEN_JS = """
async () => {
    try {
        const req = indexedDB.open('firebaseLocalStorageDb');
        return await new Promise((resolve) => {
            req.onsuccess = () => {
                const db = req.result;
                if (!db.objectStoreNames || !db.objectStoreNames.length) return resolve(null);
                const storeName = db.objectStoreNames[0];
                const tx = db.transaction(storeName, 'readonly');
                const getAllReq = tx.objectStore(storeName).getAll();
                getAllReq.onsuccess = ev => {
                    const item = ev.target.result && ev.target.result[0];
                    if (item && item.value && item.value.stsTokenManager) {
                        resolve({
                            accessToken: item.value.stsTokenManager.accessToken,
                            refreshToken: item.value.stsTokenManager.refreshToken
                        });
                    } else {
                        resolve(null);
                    }
                };
                getAllReq.onerror = () => resolve(null);
            };
            req.onerror = () => resolve(null);
        });
    } catch (err) {
        return null;
    }
}
"""


def _sanitizar_nome_pasta(email_conta):
    return re.sub(r'[^a-z0-9]+', '_', email_conta.lower())


def processar_conta(playwright, conta, config):
    senha_conta = conta.get('senha') or gerar_senha_aleatoria()

    print('\n' + '=' * 60)
    print(f'>>> PROCESSANDO CONTA: {conta["nome"]}')
    print(f'>>> E-MAIL: {conta["email"]}')
    print(f'>>> SENHA ALEATÓRIA GERADA: {senha_conta}')
    print('=' * 60)

    print(f'[IMAP] Verificando estado inicial da caixa para {conta["email"]}...')
    estado_antes = obter_estado_antes(config['gmailUser'], config['gmailAppPassword'], conta['email'])
    print(f'[IMAP] Maior UID anterior: Geral = {estado_antes["maxUidGeral"]} | Conta = {estado_antes["maxUidDestino"]}')

    PERFIS_DIR.mkdir(exist_ok=True)
    perfil_dir = PERFIS_DIR / _sanitizar_nome_pasta(conta['email'])

    # chromium_sandbox=True mantém o sandbox real do Chrome ligado (sem --no-sandbox visível).
    # channel="chrome" usa o Chrome de verdade instalado, não o Chromium que o Playwright baixaria.
    # Perfil persistente por conta: cookies/localStorage sobrevivem entre execuções dessa mesma conta.
    FLAGS_AUTOMACAO_PADRAO = [
        '--disable-sync',
        '--disable-component-update',
        '--disable-background-networking',
        '--disable-client-side-phishing-detection',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--metrics-recording-only',
        '--password-store=basic',
        '--use-mock-keychain',
        '--force-color-profile=srgb',
        '--no-service-autorun',
    ]

    context = playwright.chromium.launch_persistent_context(
        user_data_dir=str(perfil_dir),
        channel='chrome',
        executable_path=CHROME_PATH,
        headless=False,
        chromium_sandbox=True,
        no_viewport=True,
        locale='pt-BR',
        timezone_id='America/Sao_Paulo',
        ignore_default_args=FLAGS_AUTOMACAO_PADRAO,
        args=['--start-maximized'],
    )

    try:
        page = context.pages[0] if context.pages else context.new_page()

        print('\n[1/6] Acessando a página de login do Lovable (escala normal 100%)...')
        page.goto('https://lovable.dev/signup', wait_until='domcontentloaded', timeout=45000)
        time.sleep(2)

        try:
            clicar_humano_por_texto(page, ['ok', 'accept', 'aceitar', 'accept all'])
        except Exception:
            pass

        # 1. E-mail
        try:
            page.wait_for_selector('input#email', timeout=10000)
            print(f'[2/6] Digitando o e-mail: {conta["email"]}...')
            campo_email = page.locator('input#email').first
            clicar_humano(page, campo_email)
            page.keyboard.type(conta['email'], delay=random.randint(40, 110))
            time.sleep(1)
            print('[3/6] Clicando no botão "Continue"...')
            clicar_humano_por_seletor(page, 'button[type="submit"]')
        except Exception as err:
            print(f'[!] Nota: e-mail já preenchido ou falha: {err}')

        # 2. Senha
        print('[4/6] Aguardando campo de senha...')
        try:
            page.wait_for_selector('input#password', timeout=15000)
            print(f'[4/6] Digitando a senha gerada: {senha_conta}...')
            time.sleep(1)
            campo_senha = page.locator('input#password').first
            clicar_humano(page, campo_senha)
            page.keyboard.type(senha_conta, delay=random.randint(40, 110))

            page.evaluate("""() => {
                const p = document.querySelector('input#password');
                if (p) {
                    p.dispatchEvent(new Event('input', { bubbles: true }));
                    p.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }""")

            print('\n[5/6] Aguardando 8 segundos para o Cloudflare validar...')
            for s in range(8, 0, -1):
                sys.stdout.write(f'\r[-] Validação Cloudflare: {s}s restantes... ')
                sys.stdout.flush()
                time.sleep(1)
            print('\n[-] Tempo de validação concluído!')

            print('\n[+] Clicando no botão de cadastro ("Create your account" ou "Log in")...')
            submetido = False
            for tentativa in range(1, 6):
                clicar_humano_por_seletor(page, 'button[type="submit"]')
                page.keyboard.press('Enter')
                time.sleep(3)
                ainda_na_tela_senha = page.query_selector('input#password') is not None
                if not ainda_na_tela_senha:
                    submetido = True
                    print('[-] FORMULÁRIO ENVIADO COM SUCESSO! A página avançou.')
                    break
                print(f'[-] Tentativa {tentativa}: formulário ainda na tela, aguardando...')

            if not submetido:
                print('\n' + '!' * 60)
                print('>>> ATENÇÃO: o robô tentou clicar, mas a página ainda está na tela de senha.')
                print('!' * 60)
                try:
                    page.wait_for_function(
                        "() => !document.querySelector('input#password')", timeout=60000
                    )
                    print('\n[-] Confirmado! A tela avançou.')
                except Exception:
                    print('[!] Continuando para a checagem do Gmail...')
        except Exception as err:
            print(f'[!] Erro na etapa da senha: {err}')

        print('\n' + '-' * 60)
        print('>>> CONTA PROCESSADA NO SITE! AGORA BUSCANDO NO GMAIL...')
        print('-' * 60)

        print('\n[6/6] Monitorando o Gmail para capturar a ÚLTIMA mensagem de verificação recebida...')
        link_ativacao = aguardar_link_verificacao(
            config['gmailUser'], config['gmailAppPassword'], conta['email'], estado_antes, 120
        )

        if not link_ativacao:
            print('\n[AVISO] O link novo não foi identificado dentro do tempo limite.')
            return

        print('\n' + '*' * 60)
        print('>>> ÚLTIMO LINK DE ATIVAÇÃO CAPTURADO!')
        print(f'>>> {link_ativacao}')
        print('*' * 60)

        nova_aba = context.new_page()
        nova_aba.bring_to_front()
        nova_aba.goto(link_ativacao, wait_until='domcontentloaded', timeout=45000)
        print('\n>>> NOVA ABA CARREGADA COM SUCESSO! Iniciando Onboarding...')

        print('\n[-] Aguardando 6 segundos para humanizar...')
        time.sleep(6)
        print('[ONBOARDING 1/3] Clicando no primeiro botão "Next"...')
        aguardar_e_clicar_por_texto(nova_aba, ['next', 'continue'])

        print('\n[-] Aguardando 6 segundos para humanizar...')
        time.sleep(6)
        nome_limpo = re.sub(r'\s*\(.*?\)', '', conta['nome']).strip()
        print(f'[ONBOARDING 2/3] Digitando o nome "{nome_limpo}" no campo de nome...')
        nome_confirmado = preencher_nome_com_confirmacao(nova_aba, nome_limpo)
        if nome_confirmado:
            print(f'[ONBOARDING 2/3] Nome confirmado no campo: "{nome_confirmado}"')
        else:
            print('[!] AVISO: não confirmei o preenchimento do nome.')

        print('\n[-] Aguardando 6 segundos para humanizar...')
        time.sleep(6)
        if nome_confirmado:
            print('[-] Clicando no botão "Next"...')
            aguardar_e_clicar_por_texto(nova_aba, ['next', 'continue'])
        else:
            print('[!] Nome não confirmado, pulando o clique em "Next" pra não travar o onboarding.')

        print('\n[-] Aguardando 6 segundos para humanizar...')
        time.sleep(6)
        print('[ONBOARDING 3/4] Selecionando a opção "Founder"...')
        aguardar_e_clicar_por_texto(nova_aba, ['founder'])

        time.sleep(3)
        aguardar_e_clicar_por_texto(nova_aba, ['next', 'continue'], timeout_ms=5000)

        print('\n[-] Aguardando 6 segundos para humanizar...')
        time.sleep(6)
        print('[ONBOARDING 4/4] Selecionando a opção "Solo"...')
        aguardar_e_clicar_por_texto(nova_aba, ['solo'])

        time.sleep(3)
        aguardar_e_clicar_por_texto(nova_aba, ['next', 'continue', 'get started'], timeout_ms=5000)

        print('\n[TOKEN] Extraindo token de autenticação do Lovable via IndexedDB...')
        token_capturado = None
        refresh_token_capturado = None
        for _ in range(6):
            auth_data = nova_aba.evaluate(TOKEN_JS)
            if auth_data and auth_data.get('accessToken'):
                token_capturado = auth_data['accessToken']
                refresh_token_capturado = auth_data.get('refreshToken')
                break
            time.sleep(1.5)

        if token_capturado:
            print('\n' + '*' * 60)
            print('>>> TOKEN DE ACESSO CAPTURADO COM SUCESSO!')
            print(f'>>> {token_capturado[:40]}...')
            print('*' * 60)
        else:
            print('[!] Aviso: não foi possível obter o token do IndexedDB, salvando dados com a senha...')

        salvar_conta_com_token(conta['email'], token_capturado, refresh_token_capturado, nome_limpo, senha_conta)

        print('\n' + '=' * 60)
        print(f'>>> SUCESSO! A conta de {conta["nome"]} foi 100% configurada na nova aba!')
        print('=' * 60)
    finally:
        try:
            context.close()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Menu / main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--opcao', default=None)
    parser.add_argument('--qtd', default=None)
    args = parser.parse_args()

    print('=' * 60)
    print('    ASSISTENTE LOVABLE (patchright) - CHROME REAL     ')
    print('=' * 60)

    config = carregar_config()

    print('[GMAIL] Testando autenticação com o Gmail...')
    teste = testar_conexao_gmail(config['gmailUser'], config['gmailAppPassword'])
    if teste['ok']:
        print(f'[GMAIL] Conectado com sucesso ({config["gmailUser"]})!\n')
    else:
        print(f'[GMAIL] Aviso de conexão: {teste["error"]}\n')

    print('Contas configuradas:')
    for c in CONTAS_FIXAS:
        print(f' [{c["id"]}] {c["nome"]} -> {c["email"]}')
    print(' [5] Cadastrar todas as 4 contas fixas em sequência')
    print(' [6] Digitar um E-MAIL PERSONALIZADO manualmente')
    print(' [7] Gerar e cadastrar E-MAILS ALEATÓRIOS (Você escolhe a quantidade)')
    print(' [0] Sair')
    print('-' * 60)

    opcao = args.opcao if args.opcao is not None else input('\nEscolha uma opção (1 a 7, ou 0): ')
    if opcao.strip() == '0':
        sys.exit(0)

    contas_para_processar = []
    if opcao.strip() == '7':
        print('\n' + '=' * 60)
        print('>>> GERADOR DE E-MAILS ALTAMENTE ALEATÓRIOS')
        print('=' * 60)
        qtd_str = args.qtd if args.qtd is not None else input('Quantos e-mails aleatórios você deseja criar? (ex: 3, 5, 10): ')
        try:
            qtd = int(qtd_str.strip())
        except ValueError:
            qtd = 0
        if qtd <= 0:
            print('[!] Quantidade inválida. Operação cancelada.')
            sys.exit(1)
        contas_para_processar = gerar_contas_aleatorias(qtd)
        print(f'\n[OK] {qtd} contas geradas com sucesso (sem repetições):')
        for c in contas_para_processar:
            print(f' [{c["id"]}] {c["nome"]} -> {c["email"]}')
        if args.opcao is None:
            input('\nPressione [ENTER] para iniciar os cadastros... ')
    elif opcao.strip() == '6':
        email_custom = input('Digite o e-mail desejado: ')
        if not email_custom or '@' not in email_custom:
            print('[!] E-mail inválido. Encerrando.')
            sys.exit(1)
        nome_custom = input('Digite o nome para o perfil (ou tecle ENTER para usar o e-mail): ')
        if not nome_custom.strip():
            nome_custom = email_custom.split('@')[0]
        contas_para_processar = [{'id': 99, 'nome': nome_custom.strip(), 'email': email_custom.strip()}]
    elif opcao.strip() in ('5', 't'):
        contas_para_processar = CONTAS_FIXAS
    else:
        selecionada = next((c for c in CONTAS_FIXAS if str(c['id']) == opcao.strip()), None)
        contas_para_processar = [selecionada] if selecionada else CONTAS_FIXAS

    resultado = {'sucesso': [], 'falha': []}

    with sync_playwright() as playwright:
        for i, conta in enumerate(contas_para_processar):
            ok = False
            for tentativa in range(1, 3):
                try:
                    processar_conta(playwright, conta, config)
                    ok = True
                    resultado['sucesso'].append(conta['email'])
                    break
                except Exception as err:
                    print(f'\n[ERRO] Falha ao processar {conta["email"]} (tentativa {tentativa}/2): {err}')
                    if tentativa == 2:
                        resultado['falha'].append({'email': conta['email'], 'erro': str(err)})
                    else:
                        time.sleep(5)

            if i < len(contas_para_processar) - 1:
                delay_s = random.randint(15, 45)
                print(f'\n[LOTE] Aguardando {delay_s}s antes da próxima conta ({i + 2}/{len(contas_para_processar)})...')
                time.sleep(delay_s)

    print('\n' + '=' * 60)
    print(' LOTE FINALIZADO ')
    print('=' * 60)
    print(f'[OK] Sucesso: {len(resultado["sucesso"])}/{len(contas_para_processar)}')
    for e in resultado['sucesso']:
        print(f'   + {e}')
    if resultado['falha']:
        print(f'[FALHA] {len(resultado["falha"])} conta(s) não concluída(s):')
        for f in resultado['falha']:
            print(f'   - {f["email"]}: {f["erro"]}')
    print('=' * 60)


if __name__ == '__main__':
    main()
