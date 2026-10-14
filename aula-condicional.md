---
marp: true
theme: default
paginate: true
style: |
	section {
		background: #f4f3ed;
		color: #172a35;
		font-family: "Avenir Next", "Trebuchet MS", sans-serif;
		padding: 46px 58px;
	}
	h1, h2 { color: #12635b; }
	h1 { font-size: 2.15em; }
	h2 { font-size: 1.45em; }
	strong { color: #c45b36; }
	code { color: #12635b; }
	pre {
		background: #172a35;
		color: #f4f3ed;
		border-left: 7px solid #e2a33b;
		border-radius: 5px;
		padding: 18px 22px;
		font-size: 0.76em;
	}
	table { font-size: 0.82em; }
	th { background: #12635b; color: #fff; }
	td, th { border-color: #c9d2cc; }
	blockquote {
		background: #e3ede6;
		border-left: 6px solid #e2a33b;
		color: #172a35;
		padding: 10px 18px;
	}
---

# Decisões com Python
## Calculando e interpretando uma média

**Lógica de programação | Turma ENERGIF**

Uma calculadora não precisa apenas fazer contas: ela também pode decidir o resultado.

---

## Da nota ao resultado

```text
	 N1                 N2
	 peso 2             peso 3
		 \                 /
			+---- MEDIA ----+
							|
			 +------+------+
			 |      |      |
		Aprovado Recupera Reprovado
```

Primeiro calculamos a média ponderada. Depois, usamos condicionais para escolher a mensagem.

---

## Por que os pesos importam?

A N2 tem mais peso no resultado final: **3 partes**, contra **2 partes** da N1.

| Avaliação | Peso | Participação |
|:--|--:|--:|
| N1 | 2 de 5 | `■■■■□□` 40% |
| N2 | 3 de 5 | `■■■■■■` 60% |

$$
	ext{média} = \frac{(N1 \times 2) + (N2 \times 3)}{2 + 3}
$$

---

## Primeiro: fazer a conta

Este é o programa da calculadora:

```python
print("Calculadora de Média")

n1 = float(input("Digite a nota da N1: "))
n2 = float(input("Digite a nota da N2: "))

media = (n1*2 + n2*3) / 5

print("Sua média é ", media)
```

`input()` recebe texto; `float()` converte esse texto em número decimal.

---

## Acompanhe os valores

Exemplo: **N1 = 6** e **N2 = 8**

| Etapa | Cálculo | Valor |
|:--|:--|--:|
| Parte da N1 | `6 × 2` | 12 |
| Parte da N2 | `8 × 3` | 24 |
| Soma ponderada | `12 + 24` | 36 |
| Média | `36 ÷ 5` | **7,2** |

```text
N1  6,0  ── peso 2 ──┐
										 ├──> média 7,2
N2  8,0  ── peso 3 ──┘
```

---

## Agora o programa toma uma decisão

- `if`: testa a primeira condição.
- `elif`: testa outra condição se as anteriores forem falsas.
- `else`: cobre os casos que sobraram.

```text
media >= 7? ── sim ──> Aprovado
		 |
		 não
		 v
media >= 5? ── sim ──> Em recuperação
		 |
		 não
		 v
	Reprovado
```

As condições são verificadas **de cima para baixo**. Só um dos caminhos é executado.

---

## Um detalhe importante: validar as entradas

Antes de classificar a média, confira se **as duas notas** estão entre 0 e 10.

```text
N1 entre 0 e 10? ─┐
									 ├── ambas válidas? ──> classificar média
N2 entre 0 e 10? ─┘
													 |
													 não
													 v
										Nota inválida
```

O operador `or` significa **ou**: basta uma nota fora do intervalo para rejeitar as entradas.

---

## Ampliando a calculadora

Partindo do programa `notas.py`, acrescente a validação e a classificação da média:

```python
print("Calculadora de Média")

n1 = float(input("Digite a nota da N1: "))
n2 = float(input("Digite a nota da N2: "))

media = (n1*2 + n2*3) / 5

if n1 < 0 or n1 > 10 or n2 < 0 or n2 > 10:
	print("Nota inválida. Use valores de 0 a 10.")
elif media >= 7:
	print("Aprovado")
elif media >= 5:
	print("Em recuperação")
else:
	print("Reprovado")

print("Sua média é ", media)
```

---

## Teste os caminhos

| N1 | N2 | Média | Resultado |
|--:|--:|--:|:--|
| 6 | 8 | 7,2 | Aprovado |
| 4 | 5 | 4,6 | Reprovado |
| 5 | 5 | 5,0 | Em recuperação |
| 11 | 8 | 9,2 | Nota inválida |

> Repare: a validação vem antes da aprovação. Assim, uma nota inválida não passa despercebida.

---

## Pratique

1. Execute o programa com `(8, 6)`, `(5, 5)`, `(2, 3)` e `(11, 8)`.
2. Troque a ordem dos testes `media >= 7` e `media >= 5`. O que muda?
3. Altere os limites: aprovação a partir de 6 e recuperação a partir de 4.
4. Faça o programa mostrar também quanto falta para chegar à média 7.

**Dica:** use `>=`, `<=`, `>` e `<` para comparar números.
