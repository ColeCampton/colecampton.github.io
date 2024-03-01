---
layout: project
title:  "Relaxed Weighted Sub-Graph Isomorphism with Clever Factorization"
date:   2024-03-01 9:10:00 +0200
tags: ['gromov-hausdoff','graph isomorphism', 'iterative methods', 'admm]
author: "Cole Campton"
---

This post relates to solving a relaxation of the sub-graph isomorphism problem on a weighted graph. In this case we add a linear expectation term to the Gromov-Hausdorff distance (or permutation distance). The unrelaxed objective then would be 

$$
\begin{align*}
\argmin_{\Delta}\quad &\left\|\Delta d(A)\Delta^T- d(B)\right\|_F^2 - \langle W, \Delta\rangle\\
\text{subject to }& \Delta \text{ permutation}
\end{align*}
$$

Here $$d(A)$$ denotes the matrix of pairwise distances $$a_j,a_l\in A$$ as $$d(A)_{j,l} = d(a_j,a_l)$$, and similarly $$d(B)$$. Note that this distance can be any computed on the graph, often shortest path. 

Then the relaxation is given by the quadratic program with linear constrants

$$
\begin{align*}
    \argmin_{\Delta} \quad & \text{vec}(\Delta)^T P \text{vec}(\Delta) - \text{vec}(W)^T\text{vec}(\Delta)\\
    \text{subject to }& C\text{vec}(\Delta) = \Bbb{1}\\
    & \Pi^T\Pi \text{vec}(\Delta)  = \text{vec}(\Delta)\\
    &  0\le \text{vec}(\Delta)\le 1
\end{align*}
$$

Where $$C \triangleq \begin{bmatrix}I_{n}\otimes \Bbb{1}_{n}^T \\ \Bbb{1}_{n}^T\otimes I_{n}\end{bmatrix}$$ is the $$2n\times n^2$$ unsigned incidence matrix which enforces the matrix relaxation of the permutation to be doubly stochastic for right-hand-side $\Bbb{1}$, the column vector of all ones. 

The matrix $$P$$ is derived from a set of identities for the Frobenius norm $$\|\cdot\|_F$$, Kronecker product $$\otimes$$ and vectorization operator $$\text{vec}$$, which stretches a $$n\times m$$ matrix column-wise into a vector.
$$
\begin{align*}
\|\cdot\|_F^2 &= \|vecM(\cdot)\|_2^2 = \text{vec}(\cdot)^T\text{vec}(\cdot)\\
\text{vec}(ABC) &= C^T\otimes A \text{vec}(B)
\end{align*}
$$

Such that 

$$P = d(A)\otimes I_n -2\cdot d(A)\otimes d(B) + I_n\otimes d(B)$$

The resulint augmented Lagrangian is given as 
$$
\begin{align*}
L_\rho(x,y,\lambda) &= y^T P y - w^Ty +\lambda^T\left(Nx + My -b\right)\\
 &+ \frac{\rho}{2}\left\|Nx + My -b\right\|_2^2
\end{align*}
$$

where

$$N \triangleq \begin{bmatrix}0 \\ - I\end{bmatrix}, \quad M \triangleq \begin{bmatrix}C \\ I \end{bmatrix},\quad b\triangleq \begin{bmatrix} \Bbb{1}\\0\end{bmatrix}$$

which is optimized with the following updates using the Alternative Direction Method of Mulitpliers (ADMM)

$$
\begin{align*}
    x^{(k+1)} &= \textit{Project}(y^{(k)} + \begin{bmatrix}0 & I_{n^2}\end{bmatrix}\lambda^{(k)})\\
    y^{(k+1)} &= \argmin_y L_\rho(x^{(k+1)},y)\\
    \lambda^{(k+1)} &= \lambda^{(k)} +\rho \left(N x^{(k+1)}+ My^{(k+1)}-b\right)
    % \lambda^{(k+1)} &= \lambda^{(k)} +\rho\begin{bmatrix}Cy\\z-x\\ z-y\end{bmatrix}\\
\end{align*}
$$

The primal variable $$y$$-update step requires the solution the the following linear system

$$\begin{bmatrix} P+\rho I & C^T \\ C & -(1/\rho) I\end{bmatrix} \begin{bmatrix} y^{(k+1)} \\ v \end{bmatrix} = \begin{bmatrix} b^{(k+1)} \\ 0 \end{bmatrix} $$

where $$b^{(k+1)}= w +\rho\left(x^{(k)} + C^T \Bbb{1} - \begin{bmatrix} C^T & I \end{bmatrix} \lambda^{k}\right)$$. This may be carried out efficiently via a block $$LDL^T$$ factorization. Since each of $$d(A), \,d(B)$$ are symmetric we may obtain the $$Q\Lambda Q^T$$ decomposition of $$P$$ dependent blocks efficiently as the product of Kroneckeck products and sums of diagonal matrices,

$$P + \rho I = \left(Q_A\otimes Q_B\right)D_P\left(Q_A\otimes Q_B\right)^T $$

Here $$D_P = \Lambda_A^2\otimes I_n-2\Lambda_A\otimes \Lambda_B + I_n\otimes \Lambda_B^2 + \rho I$$.

The magic here is that minimizing this objective relating to this $$n^2\times n^2$$ matrix may be achieved by factoring $n\times n$ matrices $$d(A),\, d(B)$$ instead. An added charm is that the addition of the regularization term $$\text{vec}(W)^T\text{vec}(\Delta)$$ only results in a raising of the matrix $$P$$ which passes through the factorization thanks to the diagonalizability of the symmetric, real matrices $$d(A),\, d(B)$$.

