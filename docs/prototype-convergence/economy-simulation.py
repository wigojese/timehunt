import random, math, statistics as st
random.seed(7)
def card(T,w,lo,hi):
    s=random.randint(T-w+1,T); a=max(lo,s); b=min(hi,s+w-1); return (a,b)
def play(n,insight,locks,tcost,policy,menu_spec,ctx_w):
    lo,hi=0,n-1; T=random.randint(lo,hi)
    cards=[(c,w,card(T,w,lo,hi)) for c,w in menu_spec]
    L,H=lo,hi
    a,b=card(T,ctx_w,lo,hi); L,H=max(L,a),min(H,b)      # free opening context
    ins=insight; lk=locks; used_ev=0
    bought=set()
    while True:
        n_c=H-L+1
        if n_c<=lk: break
        # options
        best=None
        if policy=='evidence':
            for i,(c,w,iv) in enumerate(cards):
                if i in bought or c>ins: continue
                exp_rem=min(n_c,w); bits=math.log2(n_c/max(1,exp_rem))
                if bits<=0.2: continue
                val=bits/c
                if best is None or val>best[0]: best=(val,'e',i)
        if ins>=tcost:
            val=1.0/tcost
            if best is None or val>best[0]*1.0: best=(val,'t',None)
        if best is None: break
        if best[1]=='e':
            i=best[2]; bought.add(i); c,w,iv=cards[i]; ins-=c; used_ev+=1
            L,H=max(L,iv[0]),min(H,iv[1])
        else:
            g=(L+H)//2; ins-=tcost
            if T<=g: H=g-1 if T<g else g  # earlier (T<g) ; if T==g we model equal as "not earlier": treat as later side
            else: L=g+1
            if T==g: L,H=g,g
    # lock phase: lock at endpoints
    cand=list(range(L,H+1)); random.shuffle(cand); used=0
    won=False
    for y in cand[:lk]:
        used+=1
        if y==T: won=True;break
    unused=lk-used if won else 0
    score=(1000+100*ins+150*unused) if won else 0
    return won,score,ins,used_ev
def run(name,n=31,insight=10,locks=2,tcost=2,menu=((1,12),(2,7),(3,3)),ctx=20,N=20000):
    out=[]
    for pol in ('trace','evidence'):
        r=[play(n,insight,locks,tcost,pol,menu,ctx) for _ in range(N)]
        win=sum(x[0] for x in r)/N; sc=st.mean(x[1] for x in r); ins=st.mean(x[2] for x in r); ev=st.mean(x[3] for x in r)
        out.append((pol,win,sc,ins,ev))
    t,e=out
    print(f"{name:34s} | TraceOnly win {t[1]*100:5.1f}% score {t[2]:6.0f} | EvidenceAware win {e[1]*100:5.1f}% score {e[2]:6.0f} ({e[4]:.1f} clues) | gain {e[2]-t[2]:+5.0f}")
run('baseline 31y, 10 insight, 2 locks')
run('1 lock',locks=1)
run('3 locks',locks=3)
run('8 insight',insight=8)
run('12 insight',insight=12)
run('Trace costs 3',tcost=3)
run('61 years',n=61)
run('61 years, 12 insight',n=61,insight=12)
run('Trace 3, 1 lock',tcost=3,locks=1)
run('Trace 3, 61y, 12 insight',tcost=3,n=61,insight=12)

print("\n--- grid: want TraceOnly clearly beatable, EvidenceAware reliable ---")
import itertools
rows=[]
for n,ins,lk,tc,ctx in itertools.product((31,61,101),(8,10),(1,2),(2,3,4),(20,)):
    t=[play(n,ins,lk,tc,'trace',((1,12),(2,7),(3,3)),ctx) for _ in range(6000)]
    e=[play(n,ins,lk,tc,'evidence',((1,12),(2,7),(3,3)),ctx) for _ in range(6000)]
    tw=sum(x[0] for x in t)/6000; ew=sum(x[0] for x in e)/6000; ts=st.mean(x[1] for x in t); es=st.mean(x[1] for x in e); ec=st.mean(x[3] for x in e)
    rows.append((n,ins,lk,tc,tw,ew,ts,es,ec))
for r in rows:
    if r[4]<.9 and r[5]>.9: print(f"years {r[0]:3d} insight {r[1]:2d} locks {r[2]} trace {r[3]} | TraceOnly win {r[4]*100:5.1f}% | EvidenceAware win {r[5]*100:5.1f}%, {r[8]:.1f} clues | score gap {r[7]-r[6]:+5.0f}")
