"""Generate complete ERD views from the verified PostgreSQL catalogue, not guessed links.
[Agent: ChatGPT]. No remote service or new dependency is used.
"""
from pathlib import Path
from collections import defaultdict
import json,hashlib,html,math,re
from PIL import Image,ImageDraw,ImageFont
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'diagrams'
W=550; ROW=23; HEADER=35; GAP=65; MARGIN=80
FONTS=Path(r'C:\Windows\Fonts')
FONT=ImageFont.truetype(str(FONTS/'arial.ttf'),15)
BOLD=ImageFont.truetype(str(FONTS/'arialbd.ttf'),18)
TITLE=ImageFont.truetype(str(FONTS/'arialbd.ttf'),27)
SMALL=ImageFont.truetype(str(FONTS/'arial.ttf'),14)
COLOURS={'C01':'#315a84','C02':'#37694b','C03':'#715331','C04':'#66528a','C05':'#246e72','C06':'#576b35','C07':'#8b4750','C08':'#3b6396','C09':'#776322','C10':'#6e4d78','C11':'#2e7770','C12':'#6c5960'}
NAMES={'C01':'Accounts and workspaces','C02':'Roles, vacancies and moderation','C03':'Controlled document processing','C04':'Evidence and corrections','C05':'Private preparation and guidance','C06':'Saved preparation history','C07':'Applications and recruitment decisions','C08':'Versioned recruitment assessments','C09':'Interview coordination','C10':'Notifications and opt-in alerts','C11':'Report and campaign allowances','C12':'Privacy, audit and retention'}

def short_type(t):
    return {'timestamp with time zone':'timestamptz','character varying':'varchar','boolean':'bool','double precision':'float8'}.get(t,t)

def main():
    state=json.loads((ROOT/'erd_verification_results.json').read_text())
    digest=hashlib.sha256((ROOT/'aptivra_whole_project_schema.sql').read_bytes()).hexdigest()
    assert state.get('failed')==0 and not state.get('fatal_error') and state.get('audit_server_stopped')
    assert state['source_sha256']==digest,'Schema changed since successful verification'
    cat=json.loads((ROOT/'erd_verified_catalogue.json').read_text())
    meta={x['name']:x for x in json.loads((ROOT/'erd_design_metadata.json').read_text())}
    columns=defaultdict(list)
    for c in cat['tables']:columns[c['table_name']].append(c)
    for cols in columns.values():cols.sort(key=lambda c:c['ordinal_position'])
    edges=cat['foreign_keys']
    for e in edges:
        e['child']=e['child_table'].split('.')[-1]; e['parent']=e['parent_table'].split('.')[-1]
    assert set(meta)==set(columns)
    fkcols={(e['child'],c) for e in edges for c in e['child_columns']}
    def line(t,c):
        flags=[]
        if c['column_name']=='id':flags.append('PK')
        if (t,c['column_name']) in fkcols:flags.append('FK')
        flags.append('NOT NULL' if c['is_nullable']=='NO' else 'NULL')
        return c['column_name']+' : '+short_type(c['data_type'])+'  ['+', '.join(flags)+']'
    maxline=max(FONT.getlength(line(t,c)) for t,cs in columns.items() for c in cs)
    assert maxline<W-24,('Column text would clip',maxline)
    OUT.mkdir(exist_ok=True)
    pdfmetrics.registerFont(TTFont('AptivraArial',str(FONTS/'arial.ttf')))
    pdfmetrics.registerFont(TTFont('AptivraArialBold',str(FONTS/'arialbd.ttf')))
    pdf=canvas.Canvas(str(ROOT/'Aptivra_Whole_Project_ERD.pdf'),pageCompression=1)
    pdf.setTitle('Aptivra whole-project Entity Relationship Diagram')
    pdf.setAuthor('Aptivra FYP group')
    def mermaid(core):
        relevant=[e for e in edges if e['child'] in core]
        nodes=set(core)|{e['parent'] for e in relevant}
        result=['erDiagram']
        for t in sorted(nodes):
            result.append('    '+t+' {')
            cs=columns[t] if t in core else [c for c in columns[t] if c['column_name']=='id']
            for c in cs:
                typ={'timestamp with time zone':'timestamptz','USER-DEFINED':'text'}.get(c['data_type'],c['data_type'].replace(' ','_'))
                keys=[]
                if c['column_name']=='id':keys.append('PK')
                if (t,c['column_name']) in fkcols:keys.append('FK')
                result.append('        '+typ+' '+c['column_name']+(' '+','.join(keys) if keys else ''))
            result.append('    }')
        for e in relevant:
            left='||' if e['required'] else 'o|'
            right='o|' if e['unique_child'] else 'o{'
            result.append('    '+e['parent']+' '+left+'--'+right+' '+e['child']+' : "'+','.join(e['child_columns'])+'"')
        return '\n'.join(result)+'\n'
    (ROOT/'aptivra_whole_project_erd.mmd').write_text(mermaid(set(columns)),encoding='utf-8')

    def render(stem,title,core,master=False):
        core=sorted(core,key=lambda t:(meta[t]['capability'],t))
        ee=[e for e in edges if e['child'] in core]
        external=sorted({e['parent'] for e in ee}-set(core))
        nc=6 if master else min(3,max(1,math.ceil(len(core)/4)))
        boxes={}; row_top=150
        for ri in range(math.ceil(len(core)/nc)):
            group=core[ri*nc:(ri+1)*nc]
            heights=[]
            for ci,t in enumerate(group):
                h=HEADER+ROW*len(columns[t])+14
                boxes[t]=(MARGIN+ci*(W+GAP),row_top,W,h,False)
                heights.append(h)
            row_top+=max(heights)+GAP
        ext_x=MARGIN+nc*(W+GAP)
        for i,t in enumerate(external):boxes[t]=(ext_x,150+i*85,330,67,True)
        width=(ext_x+330+MARGIN if external else MARGIN+nc*(W+GAP)-GAP+MARGIN)
        width=max(width,1400)
        height=max(row_top+60,150+len(external)*85+110)
        pdf.setPageSize((width*.65,height*.65))
        pdf.saveState();pdf.scale(.65,.65);pdf.translate(0,height);pdf.scale(1,-1)
        image=Image.new('RGB',(width,height),'white');draw=ImageDraw.Draw(image)
        svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
             '<rect width="100%" height="100%" fill="white"/>',
             '<title>'+html.escape(title)+'</title>',
             '<style>text{font-family:Arial,sans-serif} .body{font-size:15px} .head{font-size:18px;font-weight:bold} .title{font-size:27px;font-weight:bold}</style>']
        def text(x,y,s,font=FONT,colour='#17212c',klass='body'):
            draw.text((x,y),s,font=font,fill=colour)
            pdf.saveState();pdf.translate(x,y+font.size);pdf.scale(1,-1)
            pdf.setFillColor(HexColor('#ffffff' if colour=='white' else colour));pdf.setFont('AptivraArialBold' if font in (BOLD,TITLE) else 'AptivraArial',font.size)
            pdf.drawString(0,0,s);pdf.restoreState()
            svg.append(f'<text x="{x}" y="{y+font.size}" fill="{colour}" class="{klass}">{html.escape(s)}</text>')
        def marker_line(points):
            draw.line(points,fill='#526779',width=2)
            pp=pdf.beginPath();pp.moveTo(*points[0])
            for xx,yy in points[1:]:pp.lineTo(xx,yy)
            pdf.setStrokeColor(HexColor('#526779'));pdf.setLineWidth(1.5);pdf.drawPath(pp)
            svg.append('<polyline points="'+' '.join(f'{xx},{yy}' for xx,yy in points)+'" fill="none" stroke="#526779" stroke-width="1.5"/>')
        def marker_circle(xx,yy):
            draw.ellipse((xx-4,yy-4,xx+4,yy+4),fill='white',outline='#526779',width=2)
            pdf.setFillColor(HexColor('#ffffff'));pdf.setStrokeColor(HexColor('#526779'));pdf.circle(xx,yy,4,fill=1,stroke=1)
            svg.append(f'<circle cx="{xx}" cy="{yy}" r="4" fill="white" stroke="#526779" stroke-width="1.5"/>')
        text(MARGIN,25,title,TITLE,klass='title')
        text(MARGIN,65,f'{len(core)} full tables | {len(ee)} foreign keys | Crow’s Foot relationships from the verified PostgreSQL 16 catalogue',SMALL)
        text(MARGIN,89,'Circle = optional; bar = one; fork = many. Unique child keys determine one-to-one links. Outside-domain tables show keys only.',SMALL)
        for k,e in enumerate(ee):
            cx,cy,cw,ch,_=boxes[e['child']];px,py,pw,ph,pstub=boxes[e['parent']]
            cidx=next(i for i,c in enumerate(columns[e['child']]) if c['column_name']==e['child_columns'][0])
            sy=cy+HEADER+cidx*ROW+ROW/2;ty=py+HEADER+ROW/2
            if e['child']==e['parent']:
                sx=cx;tx=px;mx=cx-25-(k%4)*5
            elif px<cx:
                sx=cx;tx=px+pw;mx=(sx+tx)/2
            else:
                sx=cx+cw;tx=px;mx=(sx+tx)/2
            points=[(sx,sy),(mx,sy),(mx,ty),(tx,ty)]
            draw.line(points,fill='#9aa8b6',width=1)
            pdf.setStrokeColor(HexColor('#9aa8b6'));pdf.setLineWidth(1)
            path_pdf=pdf.beginPath();path_pdf.moveTo(*points[0])
            for xx,yy in points[1:]:path_pdf.lineTo(xx,yy)
            pdf.drawPath(path_pdf)
            path='M '+' L '.join(f'{x},{y}' for x,y in points)
            svg.append(f'<g class="fk"><title>{html.escape(e["constraint_name"]+": "+e["definition"])}</title><path d="{path}" fill="none" stroke="#9aa8b6"/></g>')
            cs=1 if mx>sx else -1;ps=1 if mx>tx else -1
            marker_circle(sx+cs*21,sy)
            if e['unique_child']:marker_line([(sx+cs*8,sy-6),(sx+cs*8,sy+6)])
            else:
                for dy in (-6,0,6):marker_line([(sx,sy+dy),(sx+cs*12,sy)])
            marker_line([(tx+ps*6,ty-6),(tx+ps*6,ty+6)])
            if e['required']:marker_line([(tx+ps*15,ty-6),(tx+ps*15,ty+6)])
            else:marker_circle(tx+ps*17,ty)
        for t,(x,y,w,h,stub) in boxes.items():
            colour=COLOURS[meta[t]['capability']]
            draw.rectangle((x,y,x+w,y+h),fill='white',outline='#52616e',width=1)
            draw.rectangle((x,y,x+w,y+HEADER),fill=colour)
            pdf.setFillColor(HexColor('#ffffff'));pdf.setStrokeColor(HexColor('#52616e'));pdf.rect(x,y,w,h,fill=1,stroke=1)
            pdf.setFillColor(HexColor(colour));pdf.rect(x,y,w,HEADER,fill=1,stroke=0)
            svg.append(f'<g class="entity" id="{t}"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="white" stroke="#52616e"/><rect x="{x}" y="{y}" width="{w}" height="{HEADER}" fill="{colour}"/>')
            text(x+10,y+7,t,BOLD,'white','head')
            cs=columns[t] if not stub else [c for c in columns[t] if c['column_name']=='id']
            for i,c in enumerate(cs):text(x+10,y+HEADER+4+i*ROW,line(t,c))
            svg.append('</g>')
        text(MARGIN,height-48,'Aptivra · proposed whole-project design · 27 October 2026 · advisor review required before submission',SMALL)
        text(MARGIN,height-26,'Private preparation, recruitment, sources and purpose-specific retention remain separate. This is not a claim that all features are implemented.',SMALL)
        svg.append('</svg>')
        (OUT/(stem+'.svg')).write_text('\n'.join(svg),encoding='utf-8')
        image.save(OUT/(stem+'.png'),optimize=True)
        (OUT/(stem+'.mmd')).write_text(mermaid(set(core)),encoding='utf-8')
        pdf.restoreState();pdf.showPage()
        return image
    images=[render('Aptivra_Whole_Project_ERD','Aptivra — whole-project Entity Relationship Diagram',set(columns),True)]
    for cap in sorted(NAMES):
        core={t for t in columns if meta[t]['capability']==cap}
        if core:images.append(render(cap+'_'+NAMES[cap].replace(' ','_').replace(',',''),cap+' — '+NAMES[cap],core))
    pdf.save()
    inventory={}
    for p in OUT.iterdir():
        if p.suffix in ('.svg','.png','.mmd'):inventory[p.name]=hashlib.sha256(p.read_bytes()).hexdigest()
    result={'source_sha256':digest,'tables':len(columns),'foreign_keys':len(edges),'pdf_pages':len(images),'images':inventory}
    (ROOT/'erd_diagram_integrity.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='images'}))

if __name__=='__main__':main()
