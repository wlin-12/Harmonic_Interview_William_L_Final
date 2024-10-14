from typing import Annotated, List
import uuid

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db import database
from backend.routes.companies import (
    CompanyBatchOutput,
    fetch_companies_with_liked,
)

router = APIRouter(
    prefix="/collections",
    tags=["collections"],
)


class CompanyCollectionMetadata(BaseModel):
    id: uuid.UUID
    collection_name: str


class CompanyCollectionOutput(CompanyBatchOutput, CompanyCollectionMetadata):
    pass


@router.get("", response_model=list[CompanyCollectionMetadata])
def get_all_collection_metadata(
    db: Session = Depends(database.get_db),
):
    collections = db.query(database.CompanyCollection).all()

    return [
        CompanyCollectionMetadata(
            id=collection.id,
            collection_name=collection.collection_name,
        )
        for collection in collections
    ]


@router.get("/{collection_id}", response_model=CompanyCollectionOutput)
def get_company_collection_by_id(
    collection_id: uuid.UUID,
    offset: int = Query(
        0, description="The number of items to skip from the beginning"
    ),
    limit: int = Query(10, description="The number of items to fetch"),
    db: Session = Depends(database.get_db),
):
    query = (
        db.query(database.CompanyCollectionAssociation, database.Company)
        .join(database.Company)
        .filter(database.CompanyCollectionAssociation.collection_id == collection_id)
    )

    total_count = query.with_entities(func.count()).scalar()

    results = query.offset(offset).limit(limit).all()
    companies = fetch_companies_with_liked(db, [company.id for _, company in results])

    return CompanyCollectionOutput(
        id=collection_id,
        collection_name=db.query(database.CompanyCollection)
        .get(collection_id)
        .collection_name,
        companies=companies,
        total=total_count,
    )

@router.get("/{collection_id}", response_model=CompanyCollectionOutput)
def get_company_collection_by_id(
    collection_id: uuid.UUID,
    offset: int = Query(
        0, description="The number of items to skip from the beginning"
    ),
    limit: int = Query(10, description="The number of items to fetch"),
    db: Session = Depends(database.get_db),
):
    query = (
        db.query(database.CompanyCollectionAssociation, database.Company)
        .join(database.Company)
        .filter(database.CompanyCollectionAssociation.collection_id == collection_id)
    )

    total_count = query.with_entities(func.count()).scalar()

    results = query.offset(offset).limit(limit).all()
    companies = fetch_companies_with_liked(db, [company.id for _, company in results])

    return CompanyCollectionOutput(
        id=collection_id,
        collection_name=db.query(database.CompanyCollection)
        .get(collection_id)
        .collection_name,
        companies=companies,
        total=total_count,
    )

@router.post("/add_individual_company_to_liked_companies")
def add_individual_company_to_liked_companies(
    company_ids: List[int],
    db: Session = Depends(database.get_db),
):
    companies_list = (
        db.query(database.CompanyCollection)
        .filter(database.CompanyCollection.collection_name == "Liked Companies")
        .first()
    )

    associations = (
        db.query(database.CompanyCollectionAssociation)
        .filter(database.Company.id.in_(company_ids))
        .filter(
            database.CompanyCollectionAssociation.collection_id == companies_list.id,
        )
        .all()
    )

    company_id_list = {association.company_id for association in associations}

    companies = (
        db.query(database.Company).filter(database.Company.id.in_(company_ids)).all()
    )

    selected_companies = [company for company in companies if company.id not in company_id_list]
    new_company_collection_association = [database.CompanyCollectionAssociation(created_at = company.created_at, company_id = company.id, collection_id = companies_list.id) for company in selected_companies]
    uploaded_count = len(new_company_collection_association)
    db.add_all(new_company_collection_association)
    db.commit()
    return {"message": "We have added " + str(uploaded_count) + " to Liked Companies."}

@router.post("/add_individual_company_to_my_list")
def add_individual_company_to_my_list(
    company_ids: List[int],
    db: Session = Depends(database.get_db),
):
    companies_list = (
        db.query(database.CompanyCollection)
        .filter(database.CompanyCollection.collection_name == "My List")
        .first()
    )

    associations = (
        db.query(database.CompanyCollectionAssociation)
        .filter(database.Company.id.in_(company_ids))
        .filter(
            database.CompanyCollectionAssociation.collection_id == companies_list.id,
        )
        .all()
    )

    company_id_list = {association.company_id for association in associations}

    companies = (
        db.query(database.Company).filter(database.Company.id.in_(company_ids)).all()
    )

    selected_companies = [company for company in companies if company.id not in company_id_list]
    new_company_collection_association = [database.CompanyCollectionAssociation(created_at = company.created_at, company_id = company.id, collection_id = companies_list.id) for company in selected_companies]
    uploaded_count = len(new_company_collection_association)
    db.add_all(new_company_collection_association)
    db.commit()
    return {"message": "We have added " + str(uploaded_count) + " to My List."}

@router.post("/add_all_to_my_list")
def add_all_to_my_list(
    db: Session = Depends(database.get_db),
):
    companies_list = (
        db.query(database.CompanyCollection)
        .filter(database.CompanyCollection.collection_name == "My List")
        .first()
    )

    associations = (
        db.query(database.CompanyCollectionAssociation)
        .filter(
            database.CompanyCollectionAssociation.collection_id == companies_list.id,
        )
        .all()
    )

    company_id_list = {association.company_id for association in associations}

    companies = (
        db.query(database.Company).all()
    )
    selected_companies = [company for company in companies if company not in company_id_list]
    new_company_collection_association = [database.CompanyCollectionAssociation(created_at = company.created_at, company_id = company.id, collection_id = companies_list.id) for company in selected_companies]
    uploaded_count = len(new_company_collection_association)
    db.add_all(new_company_collection_association)
    db.commit()
    return {"message": "We have added " + str(uploaded_count) + " to My List."}


@router.post("/add_all_to_liked_companies")
def add_all_to_liked_companies(
    db: Session = Depends(database.get_db),
):
    companies_list = (
        db.query(database.CompanyCollection)
        .filter(database.CompanyCollection.collection_name == "Liked Companies")
        .first()
    )

    associations = (
        db.query(database.CompanyCollectionAssociation)
        .filter(
            database.CompanyCollectionAssociation.collection_id == companies_list.id,
        )
        .all()
    )

    company_id_list = {association.company_id for association in associations}

    companies = (
        db.query(database.Company).all()
    )

    selected_companies = [company for company in companies if company not in company_id_list]
    new_company_collection_association = [database.CompanyCollectionAssociation(created_at = company.created_at, company_id = company.id, collection_id = companies_list.id) for company in selected_companies]
    uploaded_count = len(new_company_collection_association)
    db.add_all(new_company_collection_association)
    db.commit()
    return {"message": "We have added " + str(uploaded_count) + " to Liked Companies List."}
    