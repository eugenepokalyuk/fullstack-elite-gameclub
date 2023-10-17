from sqlalchemy import create_engine, Column, Integer, String, Numeric, Boolean
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import select, desc, join, insert, and_, func, text


DATE_FORMAT_DEFAULT = '%Y-%m-%d %H:%M:%S'


DATABASE_URL = "sqlite:///./utils/data.db"  # Используем SQLite в качестве базы данных
engine = create_engine(DATABASE_URL, pool_size=20, max_overflow=-1)


Base = declarative_base()
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Pcs(Base):
    __tablename__ = "pcs"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique=True)
    name = Column(String, unique=True)
    status = Column(String)
    grid_id = Column(Integer, unique=True)
    ip = Column(String)
    description = Column(String)


class Orders(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String)
    pc_id = Column(Integer)
    start = Column(String)
    pause = Column(String)
    finish = Column(String)
    price = Column(Numeric)
    payment = Column(String)
    status = Column(String)


class Storefront(Base):
    __tablename__ = "storefront"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True)
    qty = Column(Integer, nullable=False)
    price = Column(Numeric)
    hide = Column(Integer)


class Sold(Base):
    __tablename__ = "sold"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String)
    item_id = Column(Integer)
    qty = Column(Integer)
    total = Column(Numeric)
    payment = Column(String)
    sell_date = Column(String)


class Supplies(Base):
    __tablename__ = "supplies"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_id = Column(Integer)
    qty = Column(Integer)
    add_date = Column(String)


class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String, unique=True)
    name = Column(String, unique=True)
    login = Column(String, unique=True)
    password = Column(String)


class Sessions(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String)
    user_uuid = Column(String)
    start = Column(String)
    finish = Column(String)
    status = Column(String)


class WriteOff(Base):
    __tablename__ = "writeoff"
    id = Column(Integer, autoincrement=True, primary_key=True)
    user_uuid = Column(String)
    item_id = Column(Integer)
    qty = Column(Integer)
    type = Column(String)
    description = Column(String, nullable=True)
    wo_date = Column(String)


Base.metadata.create_all(bind=engine)


def create_default_devices():
    db = Session()
    pc_arr = []
    for i in range(1,32):
        if i != 31:
            name = f'PC-{i}'
        else:
            name = 'PS5'
        pc = Pcs(name=name, status="online", grid_id=(i-1))
        pc_arr.append(pc)
        stmt = insert(Pcs).values(name=name, status='online', grid_id=(i-1)).prefix_with('OR IGNORE', dialect="sqlite")
        db.execute(stmt)
    db.commit()


create_default_devices()
